import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import Style from "./select.module.css";

type SelectOption = {
    value: string | number;
    label: string;
};

type SelectProps = {
    isMulti?: Boolean;
    options: SelectOption[];
    placeHolder?: string;
    noData?: ReactNode
    onChange?: (value: SelectOption[]) => void;
};
type Key = string | number;

const Select = ({
    isMulti,
    onChange,
    options,
    noData = <h5 className={Style.noData}>No data</h5>,
    placeHolder = "Select an option",
}: SelectProps) => {
    const [selectedValue, setSelectedValue] = useState<SelectOption[]>([]);
    const [optionsList, setOptionsList] = useState<SelectOption[]>(options);

    const [isOpen, setisOpen] = useState<Boolean>(false);
    const [highlightedIndex, setHighlightedIndex] = useState<Number | null>(0);
    const [inputVal, setInputVal] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const singleSearchRef = useRef<HTMLInputElement>(null);
    // Clear selectbox value
    const clear = useCallback((e: React.SyntheticEvent<EventTarget>) => {
        e.stopPropagation();
        setInputVal("");
        setSelectedValue([]);
        setisOpen(false)
        setOptionsList(options)
    }, []);

    const filterSingle = useCallback(() => {
        if (inputVal.length > 0) {
            const a = options.filter((item) => item.label.toLowerCase().includes(inputVal.toLowerCase()))
            setOptionsList(a)
        } else {
            setOptionsList(options)
        }
    }, [inputVal]);


    // select clicked options
    const selectOption = useCallback(
        (option: SelectOption) => {
            if (isMulti) {
                if (selectedValue?.some((item) => item.value == option.value)) {
                    setSelectedValue(
                        selectedValue?.filter((z: SelectOption) => z.value !== option.value)
                    );
                } else {
                    setSelectedValue((prev) => [...prev, option]);
                }
            } else {
                selectedValue[0]?.value !== option.value && setSelectedValue([option]);
                setOptionsList(options)
                setInputVal("");
            }
        },
        [selectedValue]
    );

    // check if clicked element already selected
    const isOptionSelected = (option: SelectOption) => {
        return selectedValue?.includes(option);
    };

    // handle onchange event
    useEffect(() => {
        selectedValue && onChange && onChange(selectedValue);
    }, [selectedValue]);

    // generate custom key
    const uuid = (): Key => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };

    // useoutsideclidk handler
    useEffect(() => {
        const listener = (event: any) => {
            // Do nothing if clicking ref's element or descendent elements
            if (
                !containerRef.current ||
                containerRef.current.contains(event.target)
            ) {
                return;
            }
            setisOpen(false);
        };
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [containerRef]);

    return (
        <div
            ref={containerRef}
            onBlur={() => setisOpen(false)}
            onClick={() => {
                setisOpen(!isOpen);
            }}
            tabIndex={0}
            className={Style.container}
        >
            {isMulti ? (
                <div className={Style.IsMultiLabelContainer}>
                    {selectedValue?.map((z: SelectOption) => {
                        return (
                            <span
                                onClick={() => {
                                    setSelectedValue((prev) =>
                                        prev.filter((i) => i.value !== z.value)
                                    );
                                }}
                                key={uuid()}
                                className={Style.IsMultiLabel}
                            >
                                {z.label}
                            </span>
                        );
                    })}
                </div>
            ) : (
                <input
                    ref={singleSearchRef}
                    onKeyUp={() => {
                        filterSingle()
                    }}
                    onChange={(e) => setInputVal(e.target.value)}
                    onBlur={(e) => e.stopPropagation()}
                    value={inputVal}
                    placeholder={selectedValue[0]?.label || placeHolder}
                    className={Style.searchInput}
                ></input>
            )}
            <button onClick={clear} className={Style["btn-clear"]}>
                &times;
            </button>
            <div className={Style.divider}></div>
            <div className={Style.caret}></div>
            <ul className={`${Style.options} ${isOpen ? Style.show : " "}`}>
                {optionsList?.length > 0 ? optionsList?.map((item, i) => {
                    return (
                        <li
                            onMouseEnter={() => setHighlightedIndex(i)}
                            onMouseLeave={() => setHighlightedIndex(null)}
                            onClick={(e) => {
                                setInputVal("");
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
                }) : noData}
            </ul>
        </div>
    );
};

export default Select;
