import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";

const Hero = async () => {
  const session = (await cookies()).get("session")?.value;
  const isLoggedIn = Boolean(session);
  return (
    <section className="relative grid grid-cols-1 md:grid-cols-2 items-center px-6 md:px-20 py-20 md:py-40 bg-[url(/images/bg-capbridge.webp)] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-gradient-to-r from-[#218AC2]/70 to-[#10565C]/70 z-0" />

      <div className="space-y-6 z-10 relative text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Fund the Future <br /> Together
        </h1>
        <p className="text-white text-base md:text-lg leading-relaxed italic">
          "Ide Hebat Layak Diperjuangkan. Bantu wujudkan mimpi besar, satu
          kontribusi kecil pada satu waktu. Gabung bersama ribuan pendukung yang
          percaya pada perubahan."
        </p>

        {!isLoggedIn && (
          <Link href="/register">
            <button className="text-white text-lg bg-[#10565C] hover:bg-[#0c4246] focus:ring-1 focus:ring-white rounded-lg px-6 py-3 me-2 mt-4 dark:bg-[#10565C] dark:hover:bg-[#0c4246] focus:outline-none dark:focus:ring-white font-extrabold">
              DAFTAR SEKARANG
            </button>
          </Link>
        )}

        <div className="flex justify-center md:justify-start gap-6 items-center">
          <h3>Berizin & Diawasi oleh: </h3>
          <img src="/images/ojk.png" alt="OJK Logo" className="h-12" />
          <img src="/images/kominfo.png" alt="kominfo Logo" className="h-12" />
          <img src="/images/ksei.png" alt="ksei Logo" className="h-12 w-28" />
        </div>

        <div className="flex justify-center md:justify-start gap-6 items-center">
          <a
            href="https://play.google.com/store/apps/details?id=com.fintekandalansolusiteknologi.fulusme"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/images/playstore-logo.svg"
              alt="Get it on Google Play"
              width={180}
              height={53}
              className="w-[145px] h-auto"
            />
          </a>
        </div>
      </div>

      <div className="mt-10 md:mt-0 z-10 relative text-white flex justify-center md:justify-end">
        <div className="relative w-fit">
          <img
            src="/images/fulusme-mobile-mockup.webp"
            alt="mockup"
            className="w-56 md:w-[72%] absolute -top-0 md:-top-10 left-1/2 -translate-x-1/2 z-20"
          />
          <img
            src="/images/investment-illustration.webp"
            alt="investment"
            className="w-72 md:w-[150%] relative z-10"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
