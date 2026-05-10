import { Order } from '../types';
import { WhatsAppIcon, PhoneIcon } from '@ff/ui/icons';

interface Props {
  order: Order;
  contactMode: 'none' | 'call' | 'whatsapp';
  setContactMode: (mode: 'none' | 'call' | 'whatsapp') => void;
  isCopied: boolean;
  handleCopy: () => void;
  handleContactClick: (mode: 'call' | 'whatsapp') => void;
  executeContact: (mode: 'call' | 'whatsapp', phone: string) => void;
}

export function OrderShippingCard({
  order,
  contactMode,
  setContactMode,
  isCopied,
  handleCopy,
  handleContactClick,
  executeContact
}: Props) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-[#111]">
      <div className="border-b border-black/10 px-6 py-4 dark:border-white/10">
        <h2 className="text-base font-bold text-black dark:text-white">Shipping Details</h2>
      </div>
      
      <div className="flex flex-col gap-3 p-6 text-sm font-semibold text-black dark:text-white">
        <div className="grid grid-cols-[130px_1fr] items-center gap-2 border-b border-black/5 pb-3 dark:border-white/5">
          <span className="text-black/50 dark:text-white/50">Full Name :</span>
          <span>{order.customer.name}</span>
        </div>
        <div className="grid grid-cols-[130px_1fr] items-center gap-2 border-b border-black/5 pb-3 dark:border-white/5">
          <span className="text-black/50 dark:text-white/50">Address :</span>
          <span>{order.shippingAddress.street}</span>
        </div>
        <div className="grid grid-cols-[130px_1fr] items-center gap-2 border-b border-black/5 pb-3 dark:border-white/5">
          <span className="text-black/50 dark:text-white/50">City :</span>
          <span>{order.shippingAddress.city}</span>
        </div>
        <div className="grid grid-cols-[130px_1fr] items-center gap-2 border-b border-black/5 pb-3 dark:border-white/5">
          <span className="text-black/50 dark:text-white/50">District :</span>
          <span>{order.shippingAddress.district || 'N/A'}</span>
        </div>
        <div className="grid grid-cols-[130px_1fr] items-center gap-2 border-b border-black/5 pb-3 dark:border-white/5">
          <span className="text-black/50 dark:text-white/50">State :</span>
          <span>{order.shippingAddress.state}</span>
        </div>
        <div className="grid grid-cols-[130px_1fr] items-center gap-2 border-b border-black/5 pb-3 dark:border-white/5">
          <span className="text-black/50 dark:text-white/50">Pincode:</span>
          <span>{order.shippingAddress.pincode}</span>
        </div>
        <div className="grid grid-cols-[130px_1fr] items-center gap-2 border-b border-black/5 pb-3 dark:border-white/5">
          <span className="text-black/50 dark:text-white/50">Mobile Number :</span>
          <span>{order.customer.phone}</span>
        </div>
        <div className="grid grid-cols-[130px_1fr] items-center gap-2">
          <span className="text-black/50 dark:text-white/50">Alt Number :</span>
          <span>{order.customer.altPhone || 'N/A'}</span>
        </div>
        
        <div className="mt-4 flex flex-col gap-3 border-t border-black/10 pt-6 dark:border-white/10">
          <button
            onClick={handleCopy}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-bold text-black shadow-sm transition-all hover:bg-black/5 active:scale-95 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-white/5"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {isCopied ? 'Copied!' : 'Copy Order Details'}
          </button>
          
          {contactMode === 'none' ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleContactClick('whatsapp')}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#20bd5a] active:scale-95"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Chat
              </button>
              <button
                onClick={() => handleContactClick('call')}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
              >
                <PhoneIcon className="h-5 w-5" />
                Call
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 rounded-xl border border-black/10 p-3 shadow-sm dark:border-white/10">
              <div className="flex items-center justify-between px-1 pb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-black/50 dark:text-white/50">
                  {contactMode === 'call' ? 'Call which number?' : 'Chat with which number?'}
                </span>
                <button onClick={() => setContactMode('none')} className="rounded-md p-1 text-black/50 transition-colors hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/5 dark:hover:text-white">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <button
                onClick={() => executeContact(contactMode, order.customer.phone)}
                className="flex items-center justify-between rounded-lg bg-black/5 px-3 py-2 text-sm font-bold text-black transition-colors hover:bg-black/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                <span>Primary</span>
                <span>{order.customer.phone}</span>
              </button>
              {order.customer.altPhone && (
                <button
                  onClick={() => executeContact(contactMode, order.customer.altPhone!)}
                  className="flex items-center justify-between rounded-lg bg-black/5 px-3 py-2 text-sm font-bold text-black transition-colors hover:bg-black/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  <span>Alternate</span>
                  <span>{order.customer.altPhone}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
