export const landing = {
  hero: {
    badge: 'AES-256-GCM Encrypted',
    title: 'Your Passwords. Your Control.',
    titleHighlight: 'Zero Knowledge.',
    description:
      'Military-grade AES-256-GCM encryption with dual-layer protection. Your passwords are encrypted in your browser before they ever leave your device. We literally cannot read them.',
    cta: 'Get Started Free',
    seeHow: 'See How It Works',
    vault: {
      title: 'My Vault',
      badge: 'AES-256 Encrypted',
      banking: 'Banking',
      email: 'Email',
      social: 'Social Media',
      dev: 'Dev Tools',
    },
  },
  nav: {
    benefits: 'Benefits',
    features: 'Security',
    tech: 'How It Works',
  },
  features: {
    title: 'Security',
    titleHighlight: 'By Design',
    subtitle: 'Every layer of Password Protector is built to keep your data safe.',
    clientSide: {
      title: 'Client-Side Encryption',
      description:
        'Your passwords are encrypted in your browser before they leave your device. The plaintext never touches our servers.',
    },
    zeroKnowledge: {
      title: 'Zero Knowledge',
      description:
        "We can't read your passwords. Ever. Not even if we wanted to. Your secret key never leaves your browser.",
    },
    dualLayer: {
      title: 'Dual-Layer Protection',
      description:
        'Encrypted twice: once with your personal secret key, and once on our servers. No single key can unlock your data.',
    },
  },
  benefits: {
    title: 'Everything You Need',
    generator: {
      title: 'Password Generator',
      description:
        'Generate cryptographically secure passwords with configurable length, symbols, and complexity.',
    },
    search: {
      title: 'Search & Organize',
      description: 'Organize passwords by category. Search, sort, and find credentials instantly.',
    },
    device: {
      title: 'Any Device',
      description:
        'Access your vault from any modern browser. Your encrypted data syncs securely across devices.',
    },
    theme: {
      title: 'Dark & Light Mode',
      description: 'Full theme support with automatic detection. Easy on the eyes, day or night.',
    },
  },
  tech: {
    title: 'How Your Passwords',
    titleHighlight: 'Stay Safe',
    subtitle:
      'A detailed look at the encryption journey your passwords take from your browser to our database and back.',
    encryption: {
      title: 'Encryption Journey',
      step1: {
        title: 'You Enter a Password',
        description:
          'Your password starts as plaintext, but only on your device. It never leaves your browser unprotected.',
      },
      step2: {
        title: 'Encrypted With YOUR Secret Key',
        description: 'AES-256-GCM encryption with a key only you know. We never see it.',
        sub: 'Secret Key \u2192 PBKDF2 (100,000 iterations) \u2192 AES-256-GCM',
      },
      step3: {
        title: 'Transported Securely',
        description:
          'The encrypted data travels over HTTPS. Even if intercepted, it is completely unreadable.',
      },
      step4: {
        title: 'Encrypted AGAIN on Our Servers',
        description:
          'A second AES-256-GCM layer using your unique account seed combined with our server secret.',
      },
      step5: {
        title: 'Stored Safely',
        description:
          'Doubly encrypted data at rest. No single key can unlock it. Even a full database breach reveals nothing.',
      },
    },
    zeroKnowledge: {
      title: 'Zero Knowledge Architecture',
      description:
        'Even if our entire database is stolen, your passwords remain safe. We literally cannot read them \u2014 that is zero knowledge.',
    },
    retrieval: {
      title: 'Retrieval Journey',
      step6: {
        title: 'You Request a Password',
        description:
          'When you need a password, your browser sends an authenticated request to our servers.',
      },
      step7: {
        title: 'Server Removes Its Layer',
        description:
          'Our server decrypts its layer, leaving the data still encrypted with your personal key.',
      },
      step8: {
        title: 'Your Browser Decrypts',
        description:
          'Your browser uses your secret key to decrypt the final layer. The plaintext appears only on your screen.',
      },
    },
    tagline: 'From browser to database and back \u2014 your password is never exposed.',
  },
  cta: {
    title: 'Start Protecting Your Passwords',
    titleHighlight: 'Today',
    description: 'Zero knowledge encryption. Free to use. Your passwords deserve real protection.',
    button: 'Create Free Account',
  },
};
