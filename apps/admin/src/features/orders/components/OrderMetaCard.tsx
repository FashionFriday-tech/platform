import { CustomSelect } from '../../../components/ui/CustomSelect';
import { type Order } from '../types';
import { COURIER_SERVICES } from '../utils/courier';

interface Props {
  order: Order;
  isEditingMeta: boolean;
  setIsEditingMeta: (val: boolean) => void;
  assignedSeller: string;
  setAssignedSeller: (val: string) => void;
  courierService: string;
  setCourierService: (val: string) => void;
  trackingId: string;
  setTrackingId: (val: string) => void;
  isTrackingSaved: boolean;
  handleSaveTracking: () => void;
  trackingUrl: string | null;
}

export function OrderMetaCard({
  order,
  isEditingMeta,
  setIsEditingMeta,
  assignedSeller,
  setAssignedSeller,
  courierService,
  setCourierService,
  trackingId,
  setTrackingId,
  isTrackingSaved,
  handleSaveTracking,
  trackingUrl,
}: Props) {
  const courierOptions = COURIER_SERVICES.map((c) => ({ label: c, value: c }));

  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-[#111]">
      <div className="flex items-center justify-between border-b border-black/5 px-6 py-4 dark:border-white/5">
        <h2 className="text-base font-bold text-black dark:text-white">Order Meta</h2>
        {!isEditingMeta ? (
          <button
            onClick={() => {
              setIsEditingMeta(true);
            }}
            className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={() => {
              setIsEditingMeta(false);
            }}
            className="text-sm font-bold text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between border-b border-black/5 pb-3 dark:border-white/5">
          <span className="text-sm text-black/50 dark:text-white/50">Order Date</span>
          <span className="text-sm font-bold text-black dark:text-white">
            {new Date(order.createdAt).toLocaleString('en-IN', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </span>
        </div>
        {!isEditingMeta ? (
          <>
            <div className="flex items-center justify-between border-b border-black/5 pb-3 dark:border-white/5">
              <span className="text-sm text-black/50 dark:text-white/50">Seller</span>
              <span className="text-sm font-bold text-black dark:text-white">{assignedSeller}</span>
            </div>
            <div className="flex items-center justify-between border-b border-black/5 pb-3 dark:border-white/5">
              <span className="text-sm text-black/50 dark:text-white/50">Courier</span>
              <span className="text-sm font-bold text-black dark:text-white">
                {courierService ?? 'Not Assigned'}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-black/5 pb-3 dark:border-white/5">
              <span className="text-sm text-black/50 dark:text-white/50">Tracking ID</span>
              <span className="text-sm font-bold text-black dark:text-white">
                {trackingId ?? 'Not Assigned'}
              </span>
            </div>
            {trackingId && trackingUrl && (
              <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-black/5 px-4 py-3 text-sm font-bold text-black transition-all hover:bg-black/10 active:scale-95 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                Track Package Live
              </a>
            )}
          </>
        ) : (
          <>
            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                Seller
              </label>
              <CustomSelect
                options={[
                  { label: 'Seller A', value: 'Seller A' },
                  { label: 'Seller B', value: 'Seller B' },
                  { label: 'Seller C', value: 'Seller C' },
                ]}
                value={assignedSeller}
                onChange={setAssignedSeller}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                Courier Partner
              </label>
              <CustomSelect
                options={courierOptions}
                value={courierService}
                onChange={setCourierService}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
                Tracking Number
              </label>
              <input
                type="text"
                value={trackingId}
                onChange={(e) => {
                  setTrackingId(e.target.value);
                }}
                placeholder="Enter tracking ID"
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black placeholder-black/20 transition-all outline-none focus:border-black/30 dark:border-white/10 dark:bg-[#111] dark:text-white dark:placeholder-white/20 dark:focus:border-white/30"
              />
            </div>
            <button
              onClick={() => {
                handleSaveTracking();
                setIsEditingMeta(false);
              }}
              className="mt-2 w-full rounded-xl bg-black px-4 py-3 text-sm font-bold text-white transition-all hover:bg-black/80 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-white/80"
            >
              {isTrackingSaved ? '✓ Saved' : 'Update Fulfillment'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
