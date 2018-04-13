/**
 * Created by jacobsansbury on 3/28/18.
 */
import mixpanel from 'mixpanel';
import { Singleton, mergeDeep } from './util';

/** This is the default manager class for Mixpanel. */
class MixpanelManager {
  /**
   * Create a MixpanelManager
   * @param {string} token - The Mixpanel token used for authentication.
   */
  constructor(token) {
    if(token) {
      // use a given token to init Mixpanel.
      this.mixpanel = mixpanel.init(token, {
        protocol: 'https'
      });
      // universal properties for tracking with every event
      this.supers = {};
    }
  }

  /**
   * Set properties on the current user's profile.
   * @param {Object} obj - The set of properties to set for that user.
   */
  people(obj) {
    this.mixpanel.people.set(obj);
  }

  /**
   * Set user for Mixpanel session, usually called at login or auth change.
   * @param {string} customer - and id, usually an email, used to uniquely identify the current user.
   */
  identify(customer) {
    this.mixpanel.identify(customer);
  }

  /**
   * Sets properties to track for every event this session.
   * @param {Object} obj - properties to track.
   */
  add(obj) {
    _.merge({}, this.supers, obj);
  }

  /**
   * Track an event with properties.
   * @param {string} type - The identifier for the event to track
   * @param {Object} payload - The properties for the tracked event.
   */
  track(type, payload) {
    this.mixpanel.track(type, _.merge({}, payload, this.supers));
  }
}

export default Singleton(MixpanelManager);
