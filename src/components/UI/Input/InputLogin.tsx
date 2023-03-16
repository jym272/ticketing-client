import styled, { css } from 'styled-components';
import { useEffect, useState } from 'react';
import { Control, FieldErrors, RegisterOptions, UseFormRegister, useWatch } from 'react-hook-form';
import { LoginInputs } from '@src/types';

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    padding-bottom: 10px;
`;

const Label = styled.label<{ $inputFocus: boolean; $error: boolean }>`
    position: absolute;
    color: #a29e9e;
    transform: translate(21px, 20px);
    transition: all 0.2s ease-in-out;
    z-index: 3;
    cursor: text;
    user-select: none;
    ${props =>
        props.$inputFocus &&
        css`
            transform: translate(19px, 4px);
            font-size: 10px;
            color: rgb(45, 51, 58);
            background-color: #fff;
            padding: 0 3px;
        `}
    ${props =>
        props.$error &&
        css`
            color: #ff0000;
        `}
`;

const Input = styled.input<{ $error: boolean }>`
    width: 300px;
    height: 35px;
    margin: 10px;
    border-radius: 5px;
    border: 1px solid #dfd9d9;
    padding: 12px;
    z-index: 2;
    outline: none;

    &:hover {
        border: 1px solid #07968b;
    }
    &:focus {
        border: 2px solid #07968b;
    }
    ${props =>
        props.$error &&
        css`
            border: 1px solid #ff0000;
        `}
`;

const capitalize = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
};

const HiddenSelector = styled.div`
    position: absolute;
    right: 5%;
    bottom: 40%;
    user-select: none;
    padding: 5px;
    border-radius: 0 5px 5px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 4;
`;

const ErrorMessage = styled.div`
    position: absolute;
    color: #ff0000;
    font-size: 11px;
    bottom: 3%;
    left: 4%;
`;

export const InputLoginComponent = ({
    name,
    register,
    control,
    errors,
    registerOptions
}: {
    name: keyof LoginInputs;
    register: UseFormRegister<LoginInputs>;
    control: Control<LoginInputs>;
    errors: FieldErrors<LoginInputs>;
    registerOptions: RegisterOptions;
}) => {
    const value = useWatch({
        control,
        name
    });
    const [inputFocus, setInputFocus] = useState(false);
    const [type, setType] = useState('text');
    const [showHiddenSelector, setShowHiddenSelector] = useState(false);
    useEffect(() => {
        if (name === 'password') {
            setType('password');
            setShowHiddenSelector(true);
        }
    }, [name]);

    return (
        <InputContainer>
            <Label $error={!!errors[name]} $inputFocus={inputFocus || !!value} htmlFor={name}>
                {capitalize(name)}
            </Label>
            <Input
                {...register(name, { required: `${capitalize(name)} is requerid`, ...registerOptions })}
                type={type}
                placeholder=""
                id={name}
                onFocus={() => setInputFocus(true)}
                onBlur={() => setInputFocus(false)}
                aria-invalid={errors[name] ? 'true' : 'false'}
                $error={!!errors[name]}
            />
            {showHiddenSelector && (
                <HiddenSelector
                    onClick={() => {
                        setType(type => (type === 'text' ? 'password' : 'text'));
                    }}
                >
                    {type === 'text' ? '👁' : '👁‍🗨'}
                </HiddenSelector>
            )}
            {errors[name] && <ErrorMessage>{errors[name]?.message}</ErrorMessage>}
        </InputContainer>
    );
};
