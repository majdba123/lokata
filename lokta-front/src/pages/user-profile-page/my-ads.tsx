import Loading from "@/components/my-ui/loading";
import useGetMyAdsQuey from "../ads/hooks/useGetMyAdsQuey";

function MyAds() {
  const myAdsQuery = useGetMyAdsQuey();

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 m-5">
      {myAdsQuery.isPending && <Loading />}
      {myAdsQuery.isSuccess &&
        myAdsQuery.data.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-5 border p-2 rounded-lg"
          >
            <div className="flex col-span-1 ">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full transition-transform hover:scale-105"
              >
                <img
                  src={item.img}
                  alt="إعلان"
                  className="w-full h-full object-fit rounded-md"
                />
              </a>
              <div className="flex flex-col gap-2"></div>
            </div>
            <p className="text-center text-2xl">
              {item.status == "completed"
                ? "مكتمل"
                : item.status == "pending"
                ? "قيد الانتظار"
                : "مرفوض"}
            </p>
          </div>
        ))}
    </div>
  );
}

export default MyAds;
