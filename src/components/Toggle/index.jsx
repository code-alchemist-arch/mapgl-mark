import classNames from 'classnames';

const dotDefaultClassName =
  'dot absolute top-1 h-4 w-4 rounded-full bg-white transition';

function Toggle({ checked, setChecked }) {
  return (
    <label
      htmlFor="toggleOne"
      className="flex transition ease-in-out duration-300 cursor-pointer select-none items-center"
    >
      <div className="relative">
        <input
          type="checkbox"
          id="toggleOne"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="sr-only"
        />
        <div
          className={classNames(
            'block h-6 w-11 rounded-full',
            checked ? 'bg-[#5BA900]' : 'bg-[#BFBFBF]',
          )}
        />
        <div
          className={classNames(
            dotDefaultClassName,
            checked ? 'right-1' : 'left-1',
          )}
        />
      </div>
    </label>
  );
}

export default Toggle;
