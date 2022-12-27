import { useCallback, useEffect, useRef, useState } from "react";
import Style from "./select.module.css";

type SelectOption = {
    value: string | number;
    label: string;
};

type SelectProps = {
    isMulti?: Boolean
    options: SelectOption[];
    placeHolder?: string;
    onChange?: (value: SelectOption[]) => void;
}
type Key = string | number

const Select = ({
    isMulti,
    onChange,
    options,
    placeHolder = "Select an option",
}: SelectProps) => {

    const [selectedValue, setSelectedValue] = useState<SelectOption[]>([])
    const [isOpen, setisOpen] = useState<Boolean>(false);
    const [highlightedIndex, setHighlightedIndex] = useState<Number | null>(0);
    const [inputVal, setInputVal] = useState('')


    const clear = useCallback((e: React.SyntheticEvent<EventTarget>) => {
        e.stopPropagation();
        setInputVal('')
        setSelectedValue([])
    }, [])


    const selectOption = useCallback((option: SelectOption) => {

        if (isMulti) {
            if (selectedValue?.some((item) => item.value == option.value)) {
                setSelectedValue(
                    selectedValue?.filter((z: SelectOption) => z.value !== option.value)
                );
            } else {
                setSelectedValue((prev) => ([...prev, option]))
            }
        } else {
            selectedValue[0]?.value !== option.value && setSelectedValue([option]);
        }
    }, [selectedValue]);


    const isOptionSelected = (option: SelectOption) => {
        return selectedValue?.includes(option)
    };

    useEffect(() => {
        selectedValue && onChange && onChange(selectedValue);
    }, [selectedValue]);

    const uuid = (): Key => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };


    return (
        <div
            onBlur={() => setisOpen(false)}
            onClick={() => { setisOpen(!isOpen) }}
            tabIndex={0}
            className={Style.container}

        >
            {isMulti ? <div className={Style.IsMultiLabelContainer}>
                {selectedValue?.map((z: SelectOption) => {
                    return <span onClick={() => {
                        setSelectedValue((prev) => prev.filter(i => i.value !== z.value))
                    }} key={uuid()} className={Style.IsMultiLabel}>{z.label}</span>;
                })}
            </div> : <input onChange={(e) => {
                console.log(e.target.value)
                setInputVal(e.target.value)
            }} onBlur={(e) => e.stopPropagation()} value={inputVal} placeholder={selectedValue[0]?.label || placeHolder} className={Style.searchInput}></input>
            }
            <button onClick={clear} className={Style["btn-clear"]}>
                &times;
            </button>
            <div className={Style.divider}></div>
            <div className={Style.caret}></div>
            <ul className={`${Style.options} ${isOpen ? Style.show : " "}`}>
                {options?.map((item, i) => {
                    return (
                        <li
                            onMouseEnter={() => setHighlightedIndex(i)}
                            onMouseLeave={() => setHighlightedIndex(null)}
                            onClick={(e) => {
                                setInputVal('')
                                e.stopPropagation();
                                selectOption(item);
                                setisOpen(false);
                            }}
                            key={uuid()}
                            className={`${Style.option} ${isOptionSelected(item) ? Style.selected : ""
                                } ${highlightedIndex === i ? Style.highlighted : ""}`}
                        >
                            {item.label}
                        </li>
                    );
                })}
            </ul>

        </div>
    );
};

export default Select;
