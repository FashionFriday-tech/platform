import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/magicUi/ScrollBasedVelocity";

function FreeShipping() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <ScrollVelocityContainer className="text-4xl font-black tracking-[-0.02em] md:text-9xl md:leading-20 uppercase">
        <ScrollVelocityRow baseVelocity={6} direction={1}>
         <span>Free Shipping On Pre-Pay</span> <img src="/logos/ff-logo.png" alt="fashion friday" width={200}/> <span>COD Avilable With +200 Advance</span> <img src="/logos/ff-logo.png" alt="fashion friday" width={200}/>
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l"></div>
    </div>
  );
}

export default FreeShipping;
