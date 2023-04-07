import { useEffect, useState } from "react";
import { signupFields } from "../lib/constants/fields.js";
import FormAction from "./FormAction";
import Input from "./Input";
import { useNavigate } from "react-router-dom";

const fields = signupFields;

let fieldsState = {};

fields.forEach((field) => (fieldsState[field.id] = ""));

export default function Profile() {
  const navigate = useNavigate();
  const [signupState, setSignupState] = useState(fieldsState);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/");
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    setSignupState({
      username: user.username,
      email: user.email,
      password: user.password,
    });
  }, []);

  const handleChange = (e) =>
    setSignupState({ ...signupState, [e.target.id]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(signupState);
    createAccount();
  };

  //handle Signup API Integration here
  const createAccount = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    // Send signup credentials to backend API
    const response = await fetch("http://localhost:3000/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: user.id,
        username: signupState.username,
        email: signupState.email,
        password: signupState.password,
      }),
    });
    const data = await response.json();

    // Handle signup success or failure
    if (response.ok) {
      console.log(data.message);

      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/todos");
    } else {
      console.error(data.message);
      alert("Invalid credentials, try again");
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="">
        {fields.map((field) => (
          <Input
            key={field.id}
            handleChange={handleChange}
            value={signupState[field.id]}
            labelText={field.labelText}
            labelFor={field.labelFor}
            id={field.id}
            name={field.name}
            type={field.type}
            isRequired={field.isRequired}
            placeholder={field.placeholder}
          />
        ))}
        <FormAction handleSubmit={handleSubmit} text="Update" />
      </div>
    </form>
  );
}
