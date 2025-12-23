// src/components/LogoSection.js
import Image from "next/image";

export default function LogoSection() {
  return (
    <div className="hidden md:flex w-1/2 items-center justify-center">
      <div className="text-center text-white px-8">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={320}
          height={320}
          className="mx-auto mb-4"
        />
        <p className="text-lg">Connect with your ideal roommate quickly and easily.</p>
      </div>
    </div>
  );
}
