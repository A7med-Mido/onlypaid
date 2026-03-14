import SomethingWentWrong from "@/components/pages/SomethingWentWrong";
import PricingModel from "@/db/models/pricing.model";
import Link from "next/link";

export default async function Page() {
  try {
    const data = await PricingModel.find({})

    return (
      <div className="min-h-screen pb-20 sm:pt-37 pt-25 px-">
        <div className="max-w-6xl mx-auto">

          <h1 className="text-4xl font-bold text-center mb-16 font-obv dark:text-white">
            Pricing Plans
          </h1>

          <div className="grid md:grid-cols-3 gap-8">
            {data.map((plan) => {
              const discountPercent = ((plan.price - plan.offer) / plan.price) * 100;
              return (
                <div
                  key={plan._id.toString()}
                  className="bg-white rounded-2xl shadow-lg p-5 flex flex-col justify-between border hover:shadow-xl transition"
                >
                  <div>

                    {plan.offer > 0 && (
                      <span className="inline-block mb-4 text-xs font-semibold bg-[#7EACB5]/30 text-[#287763] px-3 py-1 rounded-4xl">
                        {discountPercent.toFixed(1)}% OFF
                      </span>
                    )}

                    <h2 className="text-2xl font-semibold mb-2 text-gray-700 font-obv">
                      {plan.size}
                    </h2>

                    <p className="text-gray-500 mb-6 font-sans font-medium">
                      {plan.description}
                    </p>

                    <div className="flex items-end gap-2 mb-6 font-sans">
                      <span className="text-4xl font-bold text-[#30888b]">
                        {plan.offer} L.E
                      </span>

                      {plan.offer > 0 && (
                        <span className="text-gray-400 line-through">
                          {plan.price} L.E
                        </span>
                      )}
                    </div>

                  </div>

                  <Link
                    href="/dashboard/assets/add"
                    className="w-full bg-[#67969f] text-center hover:bg-[#7A7EFF] font-bold font-obv cursor-pointer text-white pb-4 pt-2 rounded-sm hover:opacity-90 transition"
                  >
                    start now →
                  </Link>

                </div>
              );
            })}
          </div>

        </div>
      </div>
    );
  } catch (error) {
    console.log(error);
    return <SomethingWentWrong error="internal server error" />;
  };
};