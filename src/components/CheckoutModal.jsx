import {
  CreditCard,
  Minus,
  Plus,
  ShoppingBag,
  X,
} from "lucide-react";

const formatINR = (value) =>
  Number(value || 0).toLocaleString("en-IN");

export default function CheckoutModal({
  open,
  cartItems,
  totalAmount,
  customer,
  setCustomer,
  paymentLoading,
  onClose,
  onAddMore,
  onChangeQuantity,
  onPayNow,
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-end
        justify-center
        bg-black/50
        backdrop-blur-[2px]
        sm:items-center
        sm:p-4
      "
      onClick={() => {
        if (!paymentLoading) {
          onClose();
        }
      }}
    >
      {/* ===================================================
          MODAL
      =================================================== */}

      <div
        className="
          flex
          max-h-[92vh]
          w-full
          flex-col
          rounded-t-[26px]
          bg-white
          shadow-2xl
          sm:max-w-md
          sm:rounded-[24px]
        "
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* MOBILE HANDLE */}

        <div
          className="
            mx-auto
            mt-4
            h-1.5
            w-11
            shrink-0
            rounded-full
            bg-[#e4d3cc]
            sm:hidden
          "
        />

        {/* =================================================
            CONTENT SCROLL AREA
        ================================================= */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            p-5
            pb-3
            sm:p-6
            sm:pb-3
          "
        >
          {/* HEADER */}

          <div
            className="
              flex
              items-start
              justify-between
              gap-4
            "
          >
            <div>
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-[#410102]
                "
              >
                Checkout
              </p>

              <h2
                className="
                  mt-1
                  text-xl
                  font-black
                  text-slate-900
                  sm:text-2xl
                "
              >
                Complete Your Order
              </h2>
            </div>

            <button
              type="button"
              disabled={paymentLoading}
              onClick={onClose}
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#410102]/10
                text-[#410102]
                transition
                hover:bg-[#410102]/15
                disabled:opacity-50
              "
              aria-label="Close checkout"
            >
              <X size={18} />
            </button>
          </div>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <div
            className="
              mt-5
              rounded-2xl
              border
              border-[#410102]/10
              bg-[#fff8f8]
              p-4
            "
          >
            <div
              className="
                mb-3
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <p
                className="
                  text-sm
                  font-bold
                  text-slate-900
                "
              >
                Order Summary
              </p>

              <span
                className="
                  rounded-full
                  bg-white
                  px-2.5
                  py-1
                  text-[10px]
                  font-bold
                  text-[#410102]
                "
              >
                {cartItems.length}{" "}
                {cartItems.length === 1
                  ? "Product"
                  : "Products"}
              </span>
            </div>

            {/* ===============================================
                PRODUCTS SCROLL HERE

                More products can be added without making
                the complete checkout popup excessively tall.
            =============================================== */}

            <div
              className="
                max-h-[210px]
                space-y-3
                overflow-y-auto
                overscroll-contain
                pr-1
                sm:max-h-[240px]
              "
            >
              {cartItems.map((item) => (
                <div
                  key={item.variantId}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    bg-white/60
                    p-2
                  "
                >
                  {/* IMAGE */}

                  <div
                    className="
                      h-14
                      w-11
                      shrink-0
                      overflow-hidden
                      rounded-lg
                      bg-[#f6efef]
                    "
                  >
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />
                    ) : null}
                  </div>

                  {/* DETAILS */}

                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >
                    <p
                      className="
                        truncate
                        text-sm
                        font-semibold
                        text-slate-800
                      "
                    >
                      {item.name}
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        text-slate-500
                      "
                    >
                      Size {item.size} · ₹
                      {formatINR(item.price)}
                    </p>

                    {/* QUANTITY */}

                    <div
                      className="
                        mt-1.5
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <button
                        type="button"
                        disabled={paymentLoading}
                        onClick={() =>
                          onChangeQuantity(
                            item.variantId,
                            -1
                          )
                        }
                        className="
                          flex
                          h-6
                          w-6
                          items-center
                          justify-center
                          rounded-md
                          border
                          border-[#410102]/20
                          text-[#410102]
                          disabled:opacity-40
                        "
                      >
                        <Minus size={12} />
                      </button>

                      <span
                        className="
                          w-5
                          text-center
                          text-xs
                          font-bold
                          text-slate-900
                        "
                      >
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        disabled={paymentLoading}
                        onClick={() =>
                          onChangeQuantity(
                            item.variantId,
                            1
                          )
                        }
                        className="
                          flex
                          h-6
                          w-6
                          items-center
                          justify-center
                          rounded-md
                          bg-[#410102]
                          text-white
                          disabled:opacity-40
                        "
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* ITEM TOTAL */}

                  <p
                    className="
                      shrink-0
                      text-sm
                      font-bold
                      text-slate-900
                    "
                  >
                    ₹{formatINR(item.total)}
                  </p>
                </div>
              ))}
            </div>

            {/* TOTAL */}

            <div
              className="
                mt-4
                flex
                items-center
                justify-between
                border-t
                border-[#410102]/15
                pt-3
              "
            >
              <span
                className="
                  font-bold
                  text-slate-900
                "
              >
                Total
              </span>

              <span
                className="
                  text-xl
                  font-black
                  text-[#410102]
                "
              >
                ₹{formatINR(totalAmount)}
              </span>
            </div>
          </div>

          {/* =================================================
              CUSTOMER DETAILS
          ================================================= */}

          <div
            className="
              mt-5
              space-y-4
            "
          >
            {/* NAME */}

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Your Name
              </label>

              <input
                type="text"
                value={customer.name}
                disabled={paymentLoading}
                onChange={(event) =>
                  setCustomer(
                    (previous) => ({
                      ...previous,
                      name: event.target.value,
                    })
                  )
                }
                placeholder="Enter your name"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  px-4
                  text-sm
                  text-slate-800
                  outline-none
                  transition
                  focus:border-[#410102]
                  focus:ring-2
                  focus:ring-[#410102]/10
                  disabled:bg-slate-50
                "
              />
            </div>

            {/* MOBILE */}

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Mobile Number
              </label>

              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={customer.mobile}
                disabled={paymentLoading}
                onChange={(event) =>
                  setCustomer(
                    (previous) => ({
                      ...previous,
                      mobile:
                        event.target.value.replace(
                          /\D/g,
                          ""
                        ),
                    })
                  )
                }
                placeholder="Enter 10-digit mobile number"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  px-4
                  text-sm
                  text-slate-800
                  outline-none
                  transition
                  focus:border-[#410102]
                  focus:ring-2
                  focus:ring-[#410102]/10
                  disabled:bg-slate-50
                "
              />
            </div>

            {/* ADDRESS */}

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >
                Delivery Address
              </label>

              <textarea
                rows={3}
                maxLength={500}
                value={customer.address}
                disabled={paymentLoading}
                onChange={(event) =>
                  setCustomer(
                    (previous) => ({
                      ...previous,
                      address:
                        event.target.value,
                    })
                  )
                }
                placeholder="House no, street, area, city, pincode"
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-slate-300
                  px-4
                  py-3
                  text-sm
                  text-slate-800
                  outline-none
                  transition
                  focus:border-[#410102]
                  focus:ring-2
                  focus:ring-[#410102]/10
                  disabled:bg-slate-50
                "
              />
            </div>
          </div>
        </div>

        {/* =================================================
            BOTTOM ACTIONS

            35% Add More
            65% Pay Now

            Kept outside scroll area.
        ================================================= */}

        <form
          onSubmit={onPayNow}
          className="
            shrink-0
            border-t
            border-slate-100
            bg-white
            p-4
            pt-3
            sm:px-6
            sm:pb-6
          "
        >
          <div
            className="
              flex
              w-full
              gap-2.5
              sm:gap-3
            "
          >
            {/* =============================================
                ADD MORE - 35%
            ============================================= */}

            <button
              type="button"
              disabled={paymentLoading}
              onClick={onAddMore}
              className="
                flex
                h-12
                w-[35%]
                shrink-0
                items-center
                justify-center
                gap-1.5
                rounded-xl
                border
                border-[#410102]
                bg-white
                px-2
                text-[11px]
                font-bold
                text-[#410102]
                transition
                hover:bg-[#fff0f7]
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:text-xs
              "
            >
              <ShoppingBag
                className="
                  h-4
                  w-4
                  shrink-0
                "
              />

              Add More
            </button>

            {/* =============================================
                PAY NOW - REMAINING SPACE ~65%
            ============================================= */}

            <button
              type="submit"
              disabled={paymentLoading}
              className="
                flex
                h-12
                min-w-0
                flex-1
                items-center
                justify-center
                gap-1.5
                rounded-xl
                bg-[#410102]
                px-2
                text-[11px]
                font-bold
                text-white
                shadow-md
                transition
                hover:bg-[#410102]
                disabled:cursor-not-allowed
                disabled:opacity-60
                sm:gap-2
                sm:text-xs
              "
            >
              <CreditCard
                className="
                  h-4
                  w-4
                  shrink-0
                "
              />

              {paymentLoading
                ? "Please wait..."
                : `Pay Now ₹${formatINR(
                    totalAmount
                  )}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}