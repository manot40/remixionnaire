import { Container, Input, Text } from "@nextui-org/react";
import type { CSSProperties } from "react";

import { useState } from "react";

type Option = { value: string; label: string };

type TProps = {
  selected?: string;
  options: Option[];
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  label?: string;
};

export default function SelectComponent({
  className,
  options,
  placeholder,
  selected,
  label,
  onChange = () => {},
}: TProps) {
  const initialValue = options.find((x) => x.value === selected)?.label || "";

  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [search, setSearch] = useState(initialValue);

  const selectionChanged = (option: Option) => {
    setSearch(option.label);
    onChange(option.value);
    setIsFocused(false);
    setOpen(false);
  };

  const enter = () => {
    setSearch("");
    setOpen(!open);
  };

  const leave = () => {
    if (!isFocused) {
      initialValue && setSearch(initialValue);
      setOpen(false);
      setIsFocused(false);
    }
  };

  const renderOptions = () => {
    const filtered = options.filter((option) => {
      return option.label.toLowerCase().includes(search.toLowerCase());
    });
    return filtered.length ? (
      filtered.map((option) => (
        <Container
          onClick={() => selectionChanged(option)}
          key={option.value}
          css={{
            padding: "8px .5rem 8px .5rem",
            borderBottom: "1px solid $border",
            cursor: "pointer",
            fontSize: "14px",
            "&:hover": {
              backgroundColor: "$background",
            },
          }}
        >
          {option.label}
        </Container>
      ))
    ) : (
      <Text
        onClick={enter}
        css={{
          padding: "5px 0 8px 0",
          fontSize: "14px",
          cursor: "pointer",
          textAlign: "center",
        }}
      >
        No Results
      </Text>
    );
  };

  return (
    <div style={{ position: "relative", maxWidth: "max-content" }}>
      <Input
        bordered
        label={label}
        animated={false}
        placeholder={placeholder || "Select item"}
        onClick={enter}
        onBlur={leave}
        value={search}
        className={className}
        onChange={(e) => setSearch(e.target.value)}
      />
      {open && (
        <Container
          onMouseOver={() => setIsFocused(true)}
          onMouseLeave={() => setIsFocused(false)}
          className="selection"
          css={{
            padding: "0",
            width: "100%",
            maxHeight: "8rem",
            background: "$gray100",
            borderRadius: "$lg",
            position: "absolute",
            zIndex: 9999,
            marginTop: "8px",
            border: "1px solid $border",
          }}
        >
          {renderOptions()}
        </Container>
      )}
    </div>
  );
}
