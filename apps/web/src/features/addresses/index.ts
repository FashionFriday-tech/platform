export { AddressesPage } from './components/addresses-page';
export { useAddresses } from './hooks/use-addresses';
export {
  createAddressAction,
  deleteAddressAction,
  fetchUserAddressesAction,
  setDefaultAddressAction,
  updateAddressAction,
} from './services/addresses.actions';
export type { Address } from './types';
export { cleanPhoneDigits, formatPhone334 } from './utils/phone';
