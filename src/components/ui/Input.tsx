import classNames from "classnames";
import React, { InputHTMLAttributes } from "react";

export default function Input({
  className,
  description,
  errors,
  label,
  name,
}: InputHTMLAttributes<HTMLInputElement> & {
  description?: string;
  errors?: string[] | undefined;
  label: string;
}) {
  return (
    <div className={classNames("input-group has-validation", className)}>
      <div className={classNames("form-floating", { "is-invalid": errors })}>
        <input
          className={classNames("form-control", { "is-invalid": errors })}
          id={`${name}__input`}
          name={name}
          placeholder=""
          type="text"
        />

        <label htmlFor={`${name}__input`}>{label}</label>

        {description && <div className="form-text">{description}</div>}
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
