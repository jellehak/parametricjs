export default [
  { url: '#/dashboard', icon: 'home', text: 'Dashboard' },

  // Bookings
  // { icon: 'insert_invitation', heading: 'Bookings' },
  { url: '#/calendar', icon: 'insert_invitation', text: 'Calendar' },
  { url: '#/bookingorders', icon: 'event_note', text: 'Orders' },
  { url: '#/bookings', icon: 'event_note', text: 'Bookings' },
  { url: '#/payments', icon: 'attach_money', text: 'Payments' },
  { url: '#/clients', icon: 'perm_identity', text: 'Clients' },
  { url: '#/channels', icon: 'list', text: 'Channels' },

  {
    icon: 'keyboard_arrow_up',
    'icon-alt': 'keyboard_arrow_down',
    text: 'Inventory',
    model: false,
    children: [
      { url: '#/locations', icon: 'my_location', text: 'Locations' },
      { url: '#/resourcetypes', icon: 'label', text: 'Room Types' },
      { url: '#/resources', icon: 'home', text: 'Rooms' },
      // { url: '#/slots', icon: 'view_agenda', text: 'Slots' },
      { url: '#/extras', icon: 'list', text: 'Extras' }

    ]
  },

  { url: '#/settings/form', icon: 'settings', text: 'Setup' },

  // Settings (WIP)
  {
    icon: 'keyboard_arrow_up',
    'icon-alt': 'keyboard_arrow_down',
    text: 'Settings',
    model: false,
    children: [
      { url: '#/templates', icon: 'code', text: 'Templates' },
      // { url: '#/messages', icon: 'chat', text: 'Messages' },
      // { url: '#/company', icon: 'business', text: 'Company' },
      { url: '#/accounts', icon: 'perm_identity', text: 'Accounts' },
      { url: '#/settings', icon: 'settings', text: 'Settings' },
      { url: '#/embed', icon: 'settings', text: 'Integrate' }
      // { url: '#/plugins/moneybird', icon: 'attach_money', text: 'Moneybird' }

    ]
  }

]
