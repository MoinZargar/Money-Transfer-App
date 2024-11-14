function InputBox({ placeholder, label, type, onChange, value, className="w-full px-2 py-1 brder rounoded border-slate-200" }) {
    return (
        <div>
            <div className="text-sm font-medium text-left py-2">
                {label}
            </div>
            <input
                placeholder={placeholder}
                className={`${className}`}
                type={type}
                onChange={onChange}
                value={value}
            />
        </div>
    );
}

export default InputBox;