

export type User = {
    id: string;
    role: 'student' | 'school' | 'company' | 'admin';
    fullName: string;
    email: string;
    
    // Common optional fields
    contactInfo?: string;
    profilePictureUrl?: string;
    
    // Student-specific
    schoolId?: string;
    programEnrolled?: string;
    address?: string;
    region?: string;
    institutionalEmail?: string;
    schoolIdDocumentUrl?: string;
    transcriptUrl?: string;
    birthCertificateUrl?: string;
    confirmed?: boolean;
    
    // School-specific
    programs?: string[];
    
    // Company-specific
    logoUrl?: string;
    headerImageUrl?: string;
    shortIntroduction?: string;

    // For pending accounts
    pending?: boolean;
};

export type Company = {
    id: string;
    fullName: string;
    email: string;
    logoUrl?: string;
    headerImageUrl?: string;
    shortIntroduction?: string;
}

export type Job = {
    id: string;
    companyId: string;
    program: string;
    jobIntroduction: string;
    qualifications: string;
    requiredDocuments: string;
};
  
export type Application = {
    id: string;
    studentId: string;
    jobId: string;
    companyId: string;
    submissionDate: string; // ISO 8601 format
    status: 'Under Review' | 'Accepted' | 'Rejected' | 'Needs Resubmission';
    companyNote?: string;
};

export type ChatMessage = {
    id: string;
    senderId: string;
    recipientId: string;
    messageText: string;
    timestamp: any; // Firestore ServerTimestamp
    attachmentUrl?: string;
}
