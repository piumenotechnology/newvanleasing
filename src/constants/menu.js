import { adminRoot } from "./config";
import { UserRole } from "../utils/auth.roles";

const data = [
// {
//   id: "dashboard",
//   icon: "simple-icon-screen-desktop",
//   label: "menu.dashboard",
//   to: `${adminRoot}/dashboard`,
// },
{
  id: "vehicles",
  icon: "iconsminds-car",
  label: "menu.vehicles",
  to: `${adminRoot}/vehicles`,
  subs: [{
    icon: "iconsminds-car",
    label: "menu.all-vehicles",
    to: `${adminRoot}/vehicles/all-vehicles`
  }, {
    icon: "iconsminds-check",
    label: "menu.available-stock",
    to: `${adminRoot}/vehicles/available-stock`
  }, {
    icon: "iconsminds-sand-watch-2",
    label: "menu.potential-stock",
    to: `${adminRoot}/vehicles/potential-stock`
  }, {
    icon: "iconsminds-notepad",
    label: "menu.booked-stock",
    to: `${adminRoot}/vehicles/booked-stock`
  }]
  },
{
  id: "contracts",
  icon: "simple-icon-printer",
  label: "menu.contracts",
  to: `${adminRoot}/contracts`,
  subs: [{
    icon: "iconsminds-box-full",
    label: "menu.all-contracts",
    to: `${adminRoot}/contracts/all-contracts`
  }, {
    icon: "iconsminds-timer",
    label: "menu.active-contracts",
    to: `${adminRoot}/contracts/active-contracts`
  }]
},
{
  id: "end-contracts",
  icon: "iconsminds-clock-back",
  label: "menu.end-contracts",
  to: `${adminRoot}/end-contracts`
},
{
  id: "additional",
  icon: "simple-icon-calculator",
  label: "menu.additional",
  to: `${adminRoot}/additional`,
  roles: [UserRole.Admin]
},
{
  id: "performance",
  icon: "simple-icon-rocket",
  label: "menu.performance",
  to: `${adminRoot}/performance/all`,
  roles: [UserRole.Admin]
}
// {
//   id: "single",
//   icon: "iconsminds-three-arrow-fork",
//   label: "menu.single",
//   to: `${adminRoot}/single`,
// },
// {
//   id: "docs",
//   icon: "iconsminds-library",
//   label: "menu.docs",
//   to: "https://piaf-vue-docs.coloredstrategies.com/",
//   newWindow: true
// }
];
export default data;
