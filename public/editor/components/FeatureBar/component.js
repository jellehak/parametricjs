import template from './template.html'
import { locationsService } from '@/services/index'
import items from './items'

export default {
  template: template,
  computed: {
    dark: {
      get () { return this.$store.state.dark },
      set (v) { this.$store.commit('setTheme', v) }
    }
  },
  data: () => ({
    snackbar: {
      show: true,
      color: 'error', // info success,
      text: 'Oops'
    },
    // dark: window.localStorage.getItem('theme') === 'dark',
    search: '',
    dialog: false,
    drawer: null,
    title:
      '', // 'Booking Manager'
    form: {
      location: 'all'
    },
    locations: [
      // Bookings
      { url: '#/calendar', icon: 'insert_invitation', text: 'Calendar' },
      { url: '#/bookings', icon: 'event_note', text: 'Bookings' }
    ],
    items
  }),
  async created () {
    const locations = await locationsService.get()
    this.locations = [{title: 'All', _id: 'all'}, ...locations]
  },
  watch: {
    'form.location': function (value) {
      console.log(value)
      this.$store.dispatch('setLocationFilter', {id: value})
    }
  },
  props: {
    source: String
  },
  methods: {
    submitSearch: function () {
      // console.log('test')
      this.$router.push(`/search?search=${this.search}`)
    }
  }
}
