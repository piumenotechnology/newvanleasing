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
    to: `${adminRoot}/vehicles/all-vehicles`,
    access: "vehicle.read"
  }, {
    icon: "iconsminds-check",
    label: "menu.available-stock",
    to: `${adminRoot}/vehicles/available-stock`,
    access: "vehicle_available.read"
  }, {
    icon: "iconsminds-timer",
    label: "menu.potential-stock",
    to: `${adminRoot}/vehicles/potential-stock`,
    access: "vehicle_potential.read"
  }, {
    icon: "iconsminds-file-clipboard",
    label: "menu.booked-stock",
    to: `${adminRoot}/vehicles/booked-stock`,
    access: "vehicle_booked.read"
  }, {
    icon: "iconsminds-yes",
    label: "menu.confirmed-stock",
    to: `${adminRoot}/vehicles/confirmed-stock`,
    access: "vehicle_confirmed.read"
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
    to: `${adminRoot}/contracts/all-contracts`,
    access: "contract.read"
  }, {
    icon: "iconsminds-timer",
    label: "menu.active-contracts",
    to: `${adminRoot}/contracts/active-contracts`,
    access: "contract_active.read"
  }]
},
{
  id: "end-contracts",
  icon: "iconsminds-clock-back",
  label: "menu.end-contracts",
  to: `${adminRoot}/end-contracts`,
  access: "return_defleet.read"
},
{
  id: "additional",
  icon: "simple-icon-calculator",
  label: "menu.additional",
  to: `${adminRoot}/additional`,
  access: "cost_income.read"
},
{
  id: "performance",
  icon: "simple-icon-rocket",
  label: "menu.performance",
  to: `${adminRoot}/performance/all`,
  access: "performance.read"
},
{
  id: "users",
  icon: "simple-icon-people",
  label: "menu.user-roles",
  to: `${adminRoot}/users`,
  roles: [UserRole.Administrator],
  subs: [{
    icon: "iconsminds-conference",
    label: "menu.manage-users",
    to: `${adminRoot}/users/manage-users`
  }, {
    icon: "iconsminds-id-card",
    label: "menu.manage-roles",
    to: `${adminRoot}/users/manage-roles`
  }]
},
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
