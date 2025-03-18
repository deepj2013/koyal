import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useLazyGetWaitingListQuery } from "../redux/services/waitingListService/waitingListApi";
import { formatToUTC } from "../utils/helper";
import { config } from "../config/config";

const EXPECTED_PASSWORD = config.waitingListPassword;

const WaitingList = () => {
  const [getWaitingList, { data: waitingListData }] =
    useLazyGetWaitingListQuery();

  const [waitingList, setWaitingList] = useState([]);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordSubmit = () => {
    if (password === EXPECTED_PASSWORD) {
      setIsAuthenticated(true);
      getWaitingList(null);
    } else {
      setError("Wrong password! Try again.");
    }
  };

  useEffect(() => {
    if (waitingListData) {
      setWaitingList(waitingListData.data);
    }
  }, [waitingListData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {!isAuthenticated ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-3">Enter Password</h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
              placeholder="Password"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handlePasswordSubmit}
              className="w-full bg-blue-600 text-white py-2 rounded mt-2 hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="px-20 max-w-[1400px]">
            <div className="w-full mt-10">
              <div className="w-full mt-10">
                <div className="flex justify-start w-[60%] mb-6">
                  <h1 className="text-[20px] font-medium leading-[30px] tracking-[0%] text-gray-900">
                    Waiting List
                  </h1>
                </div>
              </div>
            </div>

            <div className="w-full border border-gray-300 rounded-lg shadow-lg overflow-hidden">
              {/* Table Header */}
              <div
                id="table-header"
                className="grid grid-cols-[0.5fr_2fr_2fr_1.5fr_2fr] gap-4 p-4 bg-gray-200 border-b text-gray-700 text-sm font-semibold uppercase"
              >
                <span className="pl-4">S.N.</span>
                <span>Name</span>
                <span>Email</span>
                <span>Contact</span>
                <span className="pr-4 text-center">Created At</span>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-300 max-h-[72vh] overflow-y-auto">
                {waitingList.map(
                  ({ serialNumber, name, email, phone, createdAt }, index) => (
                    <div
                      key={serialNumber}
                      className={`grid grid-cols-[0.5fr_2fr_2fr_1.5fr_2fr] gap-4 items-center p-4 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100 transition`}
                    >
                      <p className="text-sm text-gray-800 font-medium pl-4">
                        {serialNumber}
                      </p>
                      <p className="text-sm text-gray-800">{name}</p>
                      <p className="text-sm text-gray-800">{email}</p>
                      <p className="text-sm text-gray-800">{phone}</p>
                      <p className="text-sm text-gray-800 text-center">
                        {formatToUTC(createdAt)}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaitingList;
