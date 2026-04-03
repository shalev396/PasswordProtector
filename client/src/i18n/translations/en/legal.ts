export const legal = {
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: April 3, 2026',
    section1: {
      title: '1. Introduction',
      content:
        'Password Protector is a zero-knowledge password manager. We take your privacy seriously. This policy explains what data we collect, how we use it, and what data we never have access to. Our zero-knowledge architecture means that your sensitive data is encrypted on your device before it ever reaches our servers.',
    },
    section2: {
      title: '2. Data We Collect',
      content:
        'We collect the following information to provide the Password Protector service: your email address (used for authentication via AWS Cognito), your encrypted password entries (which we cannot decrypt), and basic usage metadata such as timestamps and categories. We do not collect any additional personal information beyond what is necessary to operate the service.',
    },
    section3: {
      title: '3. Data We Do NOT Have Access To',
      content:
        'Due to our zero-knowledge architecture, we do not and cannot access: your plaintext passwords, your secret encryption key, or the contents of your stored credentials. All encryption and decryption happens locally on your device. Even if compelled by a court order, we are technically unable to read your passwords because we simply do not have the keys to decrypt them.',
    },
    section4: {
      title: '4. How We Use Your Data',
      content:
        'We use your data solely for the following purposes: authenticating your identity so you can access your vault, providing the encrypted password storage service, and enabling account recovery via your email address. We do not use your data for advertising, profiling, or any purpose other than operating Password Protector.',
    },
    section5: {
      title: '5. Third-Party Services',
      content:
        'Password Protector uses AWS Cognito for user authentication and AWS infrastructure for hosting. We do not use any analytics services, tracking pixels, advertising networks, or data brokers. Your data is never sold or shared with third parties for marketing purposes.',
    },
    section6: {
      title: '6. Data Storage & Security',
      content:
        'Your passwords are encrypted with dual-layer AES-256-GCM encryption before being stored. Our database runs in a private VPC (Virtual Private Cloud) with no direct internet access. All traffic between your browser and our servers is encrypted over HTTPS. We follow security best practices to protect the infrastructure that stores your encrypted data.',
    },
    section7: {
      title: '7. Your Rights',
      content:
        'You have the right to delete your account and all associated data at any time. You may export your data from your vault. We do not sell, rent, or share your personal information with any third parties. If you wish to exercise any of these rights, you can do so directly within the application or by contacting us.',
    },
    section8: {
      title: '8. Contact',
      content:
        'For privacy inquiries or concerns, please contact us at {{privacyEmail}}. You can also review our source code at {{repoUrl}} to verify our privacy practices for yourself.',
    },
  },
  terms: {
    title: 'Terms of Service',
    lastUpdated: 'Last updated: April 3, 2026',
    section1: {
      title: '1. Acceptance of Terms',
      content:
        'By creating an account or using Password Protector, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service. We may update these terms from time to time, and continued use of the service after changes constitutes acceptance of the updated terms.',
    },
    section2: {
      title: '2. The Service',
      content:
        'Password Protector provides encrypted password storage with a zero-knowledge architecture. This means your passwords are encrypted on your device before being transmitted to our servers, and only you hold the key to decrypt them. We provide tools to store, organize, and retrieve your encrypted credentials.',
    },
    section3: {
      title: '3. Your Responsibilities',
      content:
        'You are responsible for safeguarding your secret encryption key. If you lose your secret key, your encrypted passwords cannot be recovered by anyone, including us. You must keep your account credentials secure and must not share your account with others. You agree not to use the service for any illegal purposes or to store information related to illegal activities.',
    },
    section4: {
      title: '4. Zero-Knowledge Disclaimer',
      content:
        'Password Protector operates on a zero-knowledge basis. We cannot recover, reset, or access your encrypted data under any circumstances. Your secret encryption key is your sole responsibility. We strongly recommend keeping a secure backup of your secret key in a safe location. Loss of your secret key will result in permanent loss of access to your stored passwords.',
    },
    section5: {
      title: '5. Service Availability',
      content:
        'We aim to provide high availability for Password Protector, but we do not guarantee uninterrupted or error-free service. The service may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control. The service is provided on an "as-is" and "as-available" basis.',
    },
    section6: {
      title: '6. Limitation of Liability',
      content:
        'To the maximum extent permitted by law, Password Protector and its maintainers shall not be liable for any damages resulting from: loss of data due to forgotten or lost secret encryption keys, service interruptions or downtime, security breaches beyond our reasonable control, or any indirect, incidental, or consequential damages arising from the use of the service.',
    },
    section7: {
      title: '7. Open Source',
      content:
        'Password Protector is open-source software. You are encouraged to review, audit, and inspect the source code at any time. The source code is available at {{repoUrl}}. Contributions to the project are welcome and are subject to the project license.',
    },
    section8: {
      title: '8. Contact',
      content:
        'For questions or concerns about these Terms of Service, please contact us at {{privacyEmail}}. We will make reasonable efforts to respond to your inquiries in a timely manner.',
    },
  },
};
