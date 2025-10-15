/// SkillProof - On-chain Certificate Verification Platform
/// Phase 1: Core Data Structures & Institution Management
module skillproof::skillproof {
    use std::string::{Self, String};
    use sui::table::{Self, Table};
    use sui::event;

    // ==================== ERROR CODES ====================
    
    /// Institution is not verified to issue certificates
    const EInstitutionNotVerified: u64 = 1;
    /// Institution already exists
    const EInstitutionAlreadyExists: u64 = 2;
    /// Institution does not exist
    const EInstitutionNotFound: u64 = 3;
    /// Unauthorized action
    const EUnauthorized: u64 = 4;
    /// Certificate transfer not allowed
    const ECertificateNotTransferable: u64 = 5;

    // ==================== STRUCTS ====================

    /// AdminCap - One-time capability given to platform administrator
    /// This proves admin authority and allows managing institutions
    /// Only ONE AdminCap exists in the entire system

    public struct AdminCap has key, store {
        id: UID,
        //owner: address
    }

    /// Institution - Represents an educational institution or certificate issuer
    /// Stored in the InstitutionRegistry

    public struct Institution has store, copy, drop {
        /// Institution's wallet address
        address: address,
        /// Official name of the institution
        name: String,
        /// Contact email or website
        contact_info: String,
        /// Whether this institution is verified to issue certificates
        verified: bool,
        /// Timestamp when institution was registered
        registered_at: u64,
        /// Total number of certificates issued by this institution
        certificates_issued: u64,
    }

    /// InstitutionRegistry - Shared object that stores all institutions
    /// Anyone can read from it, but only admin can modify
    
    public struct InstitutionRegistry has key {
        id: UID,
        /// Maps institution address -> Institution data
        institutions: Table<address, Institution>,
        /// Total number of registered institutions
        total_institutions: u64,
    }


    /// Certificate - NFT representing a student's certificate
    /// This is a non-transferable soul-bound token
    public struct Certificate has key {
        id: UID,
        /// Student's name
        student_name: String,
        /// Course or program name
        course_name: String,
        /// Institution that issued this certificate
        institution_name: String,
        /// Institution's address (for verification)
        institution_address: address,
        /// Date when certificate was issued (Unix timestamp)
        issue_date: u64,
        /// Optional expiration date (0 means no expiration)
        expiration_date: u64,
        /// IPFS link to the actual certificate file (PDF, image, etc.)
        ipfs_link: String,
        /// Unique certificate hash for verification
        certificate_hash: String,
        /// Whether this certificate has been revoked
        revoked: bool,
        /// Additional metadata (e.g., grade, honors, etc.)
        metadata: String,
    }

    // ==================== EVENTS ====================

    /// Emitted when a new institution registers
    public struct InstitutionRegistered has copy, drop {
        institution_address: address,
        name: String,
        timestamp: u64,
    }

    /// Emitted when an institution is verified by admin
    public struct InstitutionVerified has copy, drop {
        institution_address: address,
        name: String,
        timestamp: u64,
    }

    /// Emitted when a certificate is minted
    public struct CertificateMinted has copy, drop {
        certificate_id: ID,
        student_name: String,
        course_name: String,
        institution_address: address,
        recipient: address,
        timestamp: u64,
    }

    /// Emitted when a certificate is revoked
    public struct CertificateRevoked has copy, drop {
        certificate_id: ID,
        institution_address: address,
        timestamp: u64,
    }

    // ==================== INITIALIZATION ====================

    /// Module initializer - runs once when the module is published
    /// Creates the AdminCap and InstitutionRegistry
    fun init(ctx: &mut TxContext) {
        // Create the AdminCap and transfer it to the publisher
        // This is the ONLY AdminCap that will ever exist
        let admin_cap = AdminCap {
            id: object::new(ctx),
        };
        transfer::transfer(admin_cap, ctx.sender());

        // Create the shared InstitutionRegistry
        // This is accessible by everyone but only modifiable by admin
        let registry = InstitutionRegistry {
            id: object::new(ctx),
            institutions: table::new(ctx),
            total_institutions: 0,
        };
        transfer::share_object(registry);
    }

    // ==================== INSTITUTION MANAGEMENT ====================

    /// Register a new institution
    /// Anyone can call this, but they won't be verified until admin approves
    public entry fun register_institution(
        registry: &mut InstitutionRegistry,
        name: String,
        contact_info: String,
        ctx: &mut TxContext,
    ) {
        let sender = ctx.sender();
        
        // Check if institution already exists
        assert!(!table::contains(&registry.institutions, sender), EInstitutionAlreadyExists);

        // Create new institution (unverified by default)
        let institution = Institution {
            address: sender,
            name,
            contact_info,
            verified: false,
            registered_at: ctx.epoch_timestamp_ms(),
            certificates_issued: 0,
        };

        // Add to registry
        table::add(&mut registry.institutions, sender, institution);
        registry.total_institutions = registry.total_institutions + 1;

        // Emit event
        event::emit(InstitutionRegistered {
            institution_address: sender,
            name: institution.name,
            timestamp: ctx.epoch_timestamp_ms(),
        });
    }

    /// Verify an institution (only admin can do this)
    /// This allows the institution to mint certificates
    public entry fun verify_institution(
        _admin_cap: &AdminCap,
        registry: &mut InstitutionRegistry,
        institution_address: address,
        ctx: &mut TxContext,
    ) {
        // Check if institution exists
        assert!(table::contains(&registry.institutions, institution_address), EInstitutionNotFound);

        // Get mutable reference and verify
        let institution = table::borrow_mut(&mut registry.institutions, institution_address);
        institution.verified = true;

        // Emit event
        event::emit(InstitutionVerified {
            institution_address,
            name: institution.name,
            timestamp: ctx.epoch_timestamp_ms(),
        });
    }

    /// Unverify an institution (only admin can do this)
    /// Revokes the institution's ability to mint certificates
    public entry fun unverify_institution(
        _admin_cap: &AdminCap,
        registry: &mut InstitutionRegistry,
        institution_address: address,
    ) {
        assert!(table::contains(&registry.institutions, institution_address), EInstitutionNotFound);
        
        let institution = table::borrow_mut(&mut registry.institutions, institution_address);
        institution.verified = false;
    }

    // ==================== CERTIFICATE MINTING ====================

    /// Mint a new certificate NFT
    /// Only verified institutions can call this function
    /// The certificate is transferred directly to the student's wallet
    public entry fun mint_certificate(
        registry: &mut InstitutionRegistry,
        student_name: String,
        course_name: String,
        recipient: address,
        expiration_date: u64,
        ipfs_link: String,
        certificate_hash: String,
        metadata: String,
        ctx: &mut TxContext,
    ) {
        let sender = ctx.sender();
        
        // Check if institution exists and is verified
        assert!(table::contains(&registry.institutions, sender), EInstitutionNotFound);
        assert!(is_institution_verified(registry, sender), EInstitutionNotVerified);

        // Get institution data to include in certificate
        let institution = table::borrow_mut(&mut registry.institutions, sender);
        let institution_name = institution.name;
        
        // Increment the institution's certificate counter
        institution.certificates_issued = institution.certificates_issued + 1;

        // Create the certificate NFT
        let certificate = Certificate {
            id: object::new(ctx),
            student_name,
            course_name,
            institution_name,
            institution_address: sender,
            issue_date: ctx.epoch_timestamp_ms(),
            expiration_date,
            ipfs_link,
            certificate_hash,
            revoked: false,
            metadata,
        };

        // Get the certificate ID before transferring
        let certificate_id = object::id(&certificate);

        // Emit event
        event::emit(CertificateMinted {
            certificate_id,
            student_name: certificate.student_name,
            course_name: certificate.course_name,
            institution_address: sender,
            recipient,
            timestamp: ctx.epoch_timestamp_ms(),
        });

        // Transfer certificate to student
        // Using transfer::transfer makes it non-transferable (soul-bound)
        transfer::transfer(certificate, recipient);
    }

    // ==================== CERTIFICATE MANAGEMENT ====================

    /// Revoke a certificate
    /// Only the institution that issued the certificate can revoke it
    /// Use cases: fraud detection, student expelled, certificate issued in error
    public entry fun revoke_certificate(
        registry: &InstitutionRegistry,
        certificate: &mut Certificate,
        ctx: &mut TxContext,
    ) {
        let sender = ctx.sender();
        
        // Verify that the caller is the institution that issued this certificate
        assert!(certificate.institution_address == sender, EUnauthorized);
        
        // Verify that the institution is still registered (extra safety check)
        assert!(table::contains(&registry.institutions, sender), EInstitutionNotFound);
        
        // Mark certificate as revoked
        certificate.revoked = true;

        // Emit event
        event::emit(CertificateRevoked {
            certificate_id: object::id(certificate),
            institution_address: sender,
            timestamp: ctx.epoch_timestamp_ms(),
        });
    }

    /// Update certificate metadata
    /// Only the institution that issued the certificate can update it
    /// Use case: Fix typos, add honors/awards, update contact info
    /// Note: Core fields (student name, course, dates) cannot be changed - revoke and reissue instead
    public entry fun update_certificate_metadata(
        registry: &InstitutionRegistry,
        certificate: &mut Certificate,
        new_metadata: String,
        ctx: &mut TxContext,
    ) {
        let sender = ctx.sender();
        
        // Verify that the caller is the institution that issued this certificate
        assert!(certificate.institution_address == sender, EUnauthorized);
        
        // Verify that the institution is still registered
        assert!(table::contains(&registry.institutions, sender), EInstitutionNotFound);
        
        // Update the metadata field
        certificate.metadata = new_metadata;
    }

    /// Update certificate IPFS link
    /// Only the institution that issued the certificate can update it
    /// Use case: Move certificate to a new IPFS gateway, update file format
    public entry fun update_certificate_ipfs(
        registry: &InstitutionRegistry,
        certificate: &mut Certificate,
        new_ipfs_link: String,
        ctx: &mut TxContext,
    ) {
        let sender = ctx.sender();
        
        // Verify that the caller is the institution that issued this certificate
        assert!(certificate.institution_address == sender, EUnauthorized);
        
        // Verify that the institution is still registered
        assert!(table::contains(&registry.institutions, sender), EInstitutionNotFound);
        
        // Update the IPFS link
        certificate.ipfs_link = new_ipfs_link;
    }

    // ==================== CERTIFICATE VIEW FUNCTIONS ====================

    /// Get complete certificate details for verification
    /// This is the main verification function that employers/verifiers will use
    public fun get_certificate_details(
        certificate: &Certificate,
    ): (String, String, String, address, u64, u64, String, String, bool, String) {
        (
            certificate.student_name,
            certificate.course_name,
            certificate.institution_name,
            certificate.institution_address,
            certificate.issue_date,
            certificate.expiration_date,
            certificate.ipfs_link,
            certificate.certificate_hash,
            certificate.revoked,
            certificate.metadata,
        )
    }

    /// Check if a certificate is valid (not revoked and not expired)
    public fun is_certificate_valid(
        certificate: &Certificate,
        current_timestamp: u64,
    ): bool {
        // Check if revoked
        if (certificate.revoked) {
            return false
        };
        
        // Check if expired (0 means no expiration)
        if (certificate.expiration_date != 0 && current_timestamp > certificate.expiration_date) {
            return false
        };
        
        true
    }

    /// Get certificate student name (for display purposes)
    public fun get_certificate_student_name(certificate: &Certificate): String {
        certificate.student_name
    }

    /// Get certificate course name (for display purposes)
    public fun get_certificate_course_name(certificate: &Certificate): String {
        certificate.course_name
    }

    /// Get certificate institution name (for display purposes)
    public fun get_certificate_institution_name(certificate: &Certificate): String {
        certificate.institution_name
    }

    /// Get certificate institution address (for verification)
    public fun get_certificate_institution_address(certificate: &Certificate): address {
        certificate.institution_address
    }

    /// Get certificate issue date
    public fun get_certificate_issue_date(certificate: &Certificate): u64 {
        certificate.issue_date
    }

    /// Get certificate expiration date
    public fun get_certificate_expiration_date(certificate: &Certificate): u64 {
        certificate.expiration_date
    }

    /// Get certificate IPFS link
    public fun get_certificate_ipfs_link(certificate: &Certificate): String {
        certificate.ipfs_link
    }

    /// Get certificate hash
    public fun get_certificate_hash(certificate: &Certificate): String {
        certificate.certificate_hash
    }

    /// Check if certificate is revoked
    public fun is_certificate_revoked(certificate: &Certificate): bool {
        certificate.revoked
    }

    /// Get certificate metadata
    public fun get_certificate_metadata(certificate: &Certificate): String {
        certificate.metadata
    }

    // ==================== INSTITUTION VIEW FUNCTIONS ====================

    /// Check if an institution is verified
    public fun is_institution_verified(
        registry: &InstitutionRegistry,
        institution_address: address,
    ): bool {
        if (!table::contains(&registry.institutions, institution_address)) {
            return false
        };
        let institution = table::borrow(&registry.institutions, institution_address);
        institution.verified
    }

    /// Get institution details
    public fun get_institution(
        registry: &InstitutionRegistry,
        institution_address: address,
    ): (String, String, bool, u64, u64) {
        assert!(table::contains(&registry.institutions, institution_address), EInstitutionNotFound);
        let institution = table::borrow(&registry.institutions, institution_address);
        (
            institution.name,
            institution.contact_info,
            institution.verified,
            institution.registered_at,
            institution.certificates_issued,
        )
    }

    /// Get total number of registered institutions
    public fun get_total_institutions(registry: &InstitutionRegistry): u64 {
        registry.total_institutions
    }
}
