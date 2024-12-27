import { isAuthGuardActive } from '../constants/config'
import { setCurrentUser, getCurrentUser } from '.'
export default (to, from, next) => {
  if (to.matched.some(record => record.meta.loginRequired)) {
    if (isAuthGuardActive) {
      const user = getCurrentUser();
      if (user) {
        const roleArrayHierarchic = to.matched.filter(x => x.meta.roles).map(x => x.meta.roles);
        // console.log(capability.includes(metaAccess[0]));
        if (roleArrayHierarchic.every(x => x.includes(user.isAdmin))) {
          next();
        } else {
          next('/unauthorized')
        }
      } else {
        setCurrentUser(null);
        next('/login')
      }
      // .map(({ slug, actions }) => ({ subject: slug, actions: actions }));
    } else {
      next();
    }
  } else {
    next()
  }
}
