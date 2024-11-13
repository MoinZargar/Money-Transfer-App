function Button({label , type , className="", onclick}) {
    return <button type={type} onClick={onclick} className={`${className} text-white`}>{label}</button>
}
export default Button;