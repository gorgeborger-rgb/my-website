const COMMANDS = [
  {
    category: 'Reset & HWID',
    icon: '🔑',
    items: [
      { command: '*hwidreset', description: 'Requests HWID reset from developer', usage: 'When user needs HWID reset', products: ['All Products'] },
      { command: '*astrohwid', description: 'Sends HWID grabber tool for AstroZoom', usage: 'User needs to send HWID for AstroZoom', products: ['AstroZoom'] },
      { command: '*checker', description: 'Sends Cosmo Checker download link', usage: 'Use to diagnose system issues', products: ['All Products'] }
    ]
  },
  {
    category: 'Windows Installation',
    icon: '🪟',
    items: [
      { command: '*windows', description: 'Windows reinstall guide with ISO and video', usage: 'When user needs fresh Windows', products: ['All Products'] },
      { command: '*wub', description: 'Windows Update Blocker download', usage: 'Block Windows updates', products: ['All Products'] }
    ]
  },
  {
    category: 'BIOS Settings',
    icon: '⚡',
    items: [
      { command: '*msisecureboot', description: 'MSI BIOS - Disable Secure Boot', usage: 'MSI motherboard users', products: ['All Products'] },
      { command: '*msitpm', description: 'MSI BIOS - Disable TPM', usage: 'MSI motherboard users', products: ['All Products'] },
      { command: '*asustpm', description: 'ASUS BIOS - Disable TPM', usage: 'ASUS motherboard users', products: ['All Products'] },
      { command: '*asussecureboot', description: 'ASUS BIOS - Disable Secure Boot', usage: 'ASUS motherboard users', products: ['All Products'] },
      { command: '*secureboot', description: 'General Secure Boot disable guide', usage: 'Other motherboard brands', products: ['All Products'] },
      { command: '*virtualization', description: 'Enable Virtualization in BIOS', usage: 'Required for all products', products: ['All Products'] },
      { command: '*vmx', description: 'Fix VMX error - run .bat file', usage: 'VMX error in Event Viewer', products: ['All Products'] }
    ]
  },
  {
    category: 'Security & Defender',
    icon: '🛡️',
    items: [
      { command: '*defendercontrol', description: 'Disable Windows Defender with tool', usage: 'Disable all Windows security', products: ['All Products'] },
      { command: '*disabledefender', description: 'Disable via Support Tool', usage: 'Alternative method', products: ['All Products'] },
      { command: '*exploitoff', description: 'Disable Exploit Protection in Windows', usage: 'Required for some products', products: ['All Products'] },
      { command: '*exploiton', description: 'Enable Exploit Protection', usage: 'After disabling', products: ['All Products'] },
      { command: '*reputation', description: 'Disable Reputation-based protection', usage: 'Windows security setting', products: ['All Products'] },
      { command: '*coreiso', description: 'Disable Core Isolation', usage: 'General Core Isolation fix', products: ['All Products'] },
      { command: '*coreisoval', description: 'Disable Core Isolation for Valorant', usage: 'Hero Valorant users', products: ['Hero Valorant'] }
    ]
  },
  {
    category: 'Visual & Setup',
    icon: '🖥️',
    items: [
      { command: '*visual', description: 'Install Visual C++ Redistributables', usage: 'Required for all products', products: ['All Products'] },
      { command: '*supporttool', description: 'Download Cosmo Support Tool', usage: 'Check system requirements', products: ['All Products'] },
      { command: '*cosmofix', description: 'Full Cosmo fix - all dependencies', usage: 'Complete fix guide', products: ['All Products'] },
      { command: '*rivatuner', description: 'RivaTuner setup video', usage: 'FPS optimization', products: ['Apex', 'All Products'] },
      { command: '*rivatunerapex', description: 'RivaTuner config for Apex', usage: 'Apex Legends settings', products: ['Apex'] },
      { command: '*cosmofast', description: 'Disable Fast Startup', usage: 'Windows power setting', products: ['All Products'] }
    ]
  },
  {
    category: 'Hyper-V & Virtualization',
    icon: '🔧',
    items: [
      { command: '*cosmohyperv', description: 'Disable Hyper-V via registry', usage: 'Hyper-V errors', products: ['Cosmo (Naxo)', 'Cosmo Pro'] },
      { command: '*cosmovirt', description: 'Disable hypervisor via CMD', usage: 'Virtualization errors', products: ['All Products'] },
      { command: '*kanehyperv', description: 'Enable Hyper-V features', usage: 'Kane specific', products: ['Kane'] },
      { command: '*proaimvirt', description: 'ProAim virtualization fix', usage: 'ProAim errors', products: ['ProAim'] }
    ]
  },
  {
    category: 'System Fixes',
    icon: '🔨',
    items: [
      { command: '*pin', description: 'Remove Windows PIN', usage: 'SVM/VMX errors', products: ['Kane', 'Liquid', 'VOLT'] },
      { command: '*iobit', description: 'Delete hvix/hvax with IObit', usage: 'SVM errors', products: ['Kane', 'Liquid'] },
      { command: '*delay', description: 'Launcher with delay .bat file', usage: 'BSOD issues', products: ['ProAim'] },
      { command: '*kaneamdmenufix', description: 'AMD menu fix for Kane', usage: 'vc_redist error on AMD', products: ['Kane'] },
      { command: '*liquidsteelseries', description: 'SteelSeries Sonar setup', usage: 'Liquid audio issues', products: ['Liquid'] },
      { command: '*removevanguard', description: 'Uninstall Riot Vanguard', usage: 'Vanguard issues', products: ['All Products'] },
      { command: '*rustdesk', description: 'RustDesk remote download', usage: 'Remote support', products: ['All Products'] }
    ]
  },
  {
    category: 'Customer Service',
    icon: '💬',
    items: [
      { command: '*restock', description: 'Restock info response', usage: 'When product out of stock', products: ['All Products'] },
      { command: '*review', description: 'Leave review request', usage: 'After successful ticket', products: ['All Products'] },
      { command: '*cheatinfo', description: 'FAQ for beginners', usage: 'New users', products: ['All Products'] }
    ]
  }
];

const BOT_LINKS = {
  commandsPage: 'https://gorgeborger2-byte.github.io/cosmo-support/commands.html',
  statusPage: 'https://support.cosmotickets.com/status/',
  supportSite: 'https://support.cosmotickets.com/'
};

if (typeof module !== 'undefined') { module.exports = { COMMANDS, BOT_LINKS }; }