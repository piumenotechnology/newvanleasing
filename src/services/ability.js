import { getCurrentUser, getCurrentCapability } from '../utils'
// import { AbilityBuilder, Ability } from '@casl/ability'
import { defineAbility } from '@casl/ability';

export default defineAbility((can) => {
  if(getCurrentUser() == null) return
  if(getCurrentUser().isAdmin === 1) {
    can('manage', 'all')
  } else {
    let permissions = getCurrentCapability()
    // can('read', 'misc')
    if(permissions) {
      for (let i = 0; i < permissions.length; i++) {
        can(permissions[i]);
      }
    }
  }
})
