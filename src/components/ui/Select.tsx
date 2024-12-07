import classNames from "classnames";
import React, { SelectHTMLAttributes } from "react";

export default function Select({
  className,
  errors,
  label,
  name,
  options,
}: SelectHTMLAttributes<HTMLSelectElement> & {
  errors?: string[] | undefined;
  label: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className={classNames("input-group has-validation", className)}>
      <div className={classNames("form-floating", { "is-invalid": errors })}>
        <select
          className={classNames("form-select", { "is-invalid": errors })}
          id={`${name}__input`}
          name={name}
        >
          {options.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <label htmlFor={`${name}__input`}>{label}</label>
      </div>

      {errors
        && errors.map((error, index, array) => (
          <div
            key={error}
            className={classNames("invalid-feedback", {
              "mb-2": index < array.length - 1,
            })}
          >
            {error}
          </div>
        ))}
    </div>
  );
}
