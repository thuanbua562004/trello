type Props = {
  CallRef: (node: HTMLElement | null) => void;
  setSateAdd: Function;
  stateOpenSetting: boolean;
  setColorBackground: Function;
  remove :React.MouseEventHandler
};
const colors = [
  "#4AC18E",
  "#EAC93B", 
  "#FCA66D",
  "#F56B6B",
  "#A88CEB", 
  "#4A8CF5", 
  "#4AB5E0", 
  "#9AC23D", 
  "#E26DB3", 
  "#6F7B8A", 
];
export default function SettingCart({
  stateOpenSetting,
  setSateAdd,
  CallRef,
  setColorBackground,
  remove
}: Props) {
  return (
    <>
      {stateOpenSetting ? (
        <div
          ref={CallRef}
          className="dark:bg-bg-dark max-w-xs mx-auto mt-10 border bg-white  rounded-md shadow-sm absolute right-5 top-5 md:top-3 z-50 md:-right-56"
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-600 ">Handler</h2>
            <button
              aria-label="Close menu"
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="px-5 py-3 space-y-3 text-sm leading-6">
            <p onClick={() => setSateAdd(true)} className="cursor-pointer hover:bg-gray-400 py-1 pl-1 rounded-lg">
              Add Task
            </p>
            <h3 className="group  cursor-pointer   relative   hover:bg-gray-400 py-1 pl-1 rounded-lg">
              Sort By…
              <ul className="dark:bg-bg-dark hidden group-hover:block -right-20 w-[200px] rounded-lg shadow-lg absolute bg-blue-50 ">
                <li className="w-full h-[45px] dark:hover:bg-gray-500 hover:bg-blue-200 px-3 rounded-md  flex items-center">
                  Name
                </li>
                <li className="w-full h-[45px] dark:hover:bg-gray-500 hover:bg-blue-200 px-3 rounded-md  flex items-center">
                  Date{" "}
                </li>
              </ul>
            </h3>
            <p onClick={remove} className="cursor-pointer  hover:bg-gray-400 py-1 pl-1 rounded-lg ">
              Remove Colmn
            </p>
          </div>
          <div className="border-t border-gray-200 px-5 pt-3 pb-2">
            <button
              type="button"
              aria-expanded="true"
              aria-controls="color-section"
              className="flex items-center gap-1 text-xs font-semibold  text-gray-800"
            >
              <span>Change color list</span>
              <span className="ml-1 rounded px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 bg-indigo-200">
                PREMIUM
              </span>
              <i className="fas fa-chevron-up ml-auto" />
            </button>
            <div
              id="color-section"
              className="mt-3 grid grid-cols-5 gap-2"
              role="list"
              aria-label="Color options"
            >
              {colors.map((color) => (
                <button
                  key={color}
                  style={{ backgroundColor: color }}
                  onClick={() => setColorBackground(color)}
                  type="button"
                  aria-pressed="false"
                  className={`w-10 h-8 rounded-md  focus:outline-none  focus:ring-offset-1 focus:ring-blue-600`}
                  aria-current="true"
                  title="Green"
                />
              ))}
            </div>
            <button
              onClick={() => setColorBackground("#E2DBDB")}
              type="button"
              className="dark:bg-gray-300 dark:hover:bg-gray-400 mt-3 w-full flex items-center justify-center gap-2 rounded bg-gray-100 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200"
            >
              <i className="fas fa-times" /> Remove Color
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
