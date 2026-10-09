import {
  Phone,
  ShoppingCart,
} from "lucide-react";

export default function Header({
  totalQuantity = 0,
  onHome,
  onContact,
}) {
  return (
    <header
      className="
        sticky
        top-0
        z-40
        border-b
        border-[#410102]/10
        bg-white
        shadow-sm
      "
    >
      <div
        className="
          mx-auto
          flex
          min-h-[78px]
          max-w-6xl
          items-center
          justify-between
          gap-2
          px-4
          py-2
          sm:px-6
          lg:px-8
        "
      >
        {/* LOGO */}

        <button
          type="button"
          onClick={onHome}
          className="flex min-w-0 items-center"
          aria-label="Go to home"
        >
          <img
            src="/coffee.jpg"
            alt="The Coffee"
            className="
              h-[56px]
              w-auto
              max-w-[150px]
              object-contain
              sm:h-[64px]
              sm:max-w-[200px]
              lg:h-[68px]
              lg:max-w-[220px]
            "
          />
        </button>

        {/* RIGHT ICONS */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-2
            sm:gap-3
          "
        >
          {/* CONTACT */}

          <button
            type="button"
            onClick={onContact}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-[#410102]/10
              text-[#410102]
              transition
              hover:bg-[#410102]
              hover:text-white
              sm:h-10
              sm:w-10
            "
            aria-label="Contact us"
          >
            <Phone
              className="
                h-4
                w-4
                sm:h-[17px]
                sm:w-[17px]
              "
            />
          </button>

          {/* CART */}

          <div
            className="
              flex
              h-9
              items-center
              justify-center
              gap-1.5
              rounded-full
              bg-[#410102]/10
              px-2.5
              text-[#410102]
              sm:h-10
              sm:gap-2
              sm:px-3
            "
          >
            <ShoppingCart
              className="
                h-4
                w-4
                sm:h-[17px]
                sm:w-[17px]
              "
            />

            <span
              className="
                text-xs
                font-bold
                sm:text-sm
              "
            >
              {totalQuantity}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}