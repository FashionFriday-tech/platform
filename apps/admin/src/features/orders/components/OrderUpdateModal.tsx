import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { CustomSelect } from '../../../components/ui/CustomSelect';
import { COURIER_SERVICES } from '../utils/courier';

interface Props {
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (val: boolean) => void;
  pendingStatus: string;
  setPendingStatus: (val: string) => void;
  tempSeller: string;
  setTempSeller: (val: string) => void;
  tempCourier: string;
  setTempCourier: (val: string) => void;
  tempTracking: string;
  setTempTracking: (val: string) => void;
  handleInquiryWhatsApp: () => void;
  setCourierService: (val: string) => void;
  setTrackingId: (val: string) => void;
  setAssignedSeller: (val: string) => void;
  setOrderStatus: (val: string) => void;
}

export function OrderUpdateModal({
  isUpdateModalOpen,
  setIsUpdateModalOpen,
  pendingStatus,
  setPendingStatus,
  tempSeller,
  setTempSeller,
  tempCourier,
  setTempCourier,
  tempTracking,
  setTempTracking,
  handleInquiryWhatsApp,
  setCourierService,
  setTrackingId,
  setAssignedSeller,
  setOrderStatus
}: Props) {
  if (!isUpdateModalOpen || typeof document === 'undefined') return null;

  const courierOptions = COURIER_SERVICES.map(c => ({ label: c, value: c }));

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#111]">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-black dark:text-white">Update Order Status</h3>
          <button onClick={() => setIsUpdateModalOpen(false)} className="text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-black/50 dark:text-white/50">Status</label>
            <CustomSelect
              options={[
                { label: 'Pending', value: 'pending' },
                { label: 'Inquiry', value: 'inquiry' },
                { label: 'Confirmed', value: 'confirmed' },
                { label: 'Shipped', value: 'shipped' },
                { label: 'Delivered', value: 'delivered' },
                { label: 'Cancelled', value: 'cancelled' },
                { label: 'Refunding', value: 'refunding' },
                { label: 'Refunded', value: 'refunded' },
              ]}
              value={pendingStatus}
              onChange={setPendingStatus}
            />
          </div>

          {pendingStatus === 'confirmed' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 flex flex-col gap-4 rounded-xl border border-black/5 bg-black/5 p-4 dark:border-white/5 dark:bg-white/5">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-black/50 dark:text-white/50">Assign Seller</label>
                <CustomSelect
                  options={[
                    { label: 'Seller A', value: 'Seller A' },
                    { label: 'Seller B', value: 'Seller B' },
                    { label: 'Seller C', value: 'Seller C' },
                  ]}
                  value={tempSeller}
                  onChange={setTempSeller}
                />
              </div>
            </motion.div>
          )}

          {pendingStatus === 'shipped' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 flex flex-col gap-4 rounded-xl border border-black/5 bg-black/5 p-4 dark:border-white/5 dark:bg-white/5">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-black/50 dark:text-white/50">Courier Service</label>
                <CustomSelect
                  options={courierOptions}
                  value={tempCourier}
                  onChange={setTempCourier}
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-black/50 dark:text-white/50">Tracking ID</label>
                <input
                  type="text"
                  value={tempTracking}
                  onChange={(e) => setTempTracking(e.target.value)}
                  placeholder="Enter Tracking ID"
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-black outline-none transition-all focus:border-black/30 focus:ring-4 focus:ring-black/5 dark:border-white/10 dark:bg-[#111] dark:text-white dark:focus:border-white/30 dark:focus:ring-white/5"
                />
              </div>
            </motion.div>
          )}

          <button
            onClick={() => {
              if (pendingStatus === 'shipped' && (!tempCourier || !tempTracking)) {
                 alert('Please enter both Courier Service and Tracking ID');
                 return;
              }
              if (pendingStatus === 'inquiry') {
                handleInquiryWhatsApp();
              }
              if (pendingStatus === 'shipped') {
                setCourierService(tempCourier);
                setTrackingId(tempTracking);
              }
              if (pendingStatus === 'confirmed') {
                setAssignedSeller(tempSeller);
              }
              setOrderStatus(pendingStatus);
              setIsUpdateModalOpen(false);
            }}
            className="mt-4 w-full rounded-xl bg-black px-4 py-3 text-sm font-bold text-white transition-all hover:bg-black/80 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-white/80"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
