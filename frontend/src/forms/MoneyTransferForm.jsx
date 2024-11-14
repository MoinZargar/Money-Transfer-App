import { moneyTransferSchema } from "../validation/account/moneyTransferSchema";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, InputBox, Card } from "../index.js";
import { useNavigate } from "react-router-dom";
import getAccountService from "../services/accountService.js";
import { useState } from "react";

function MoneyTransferForm({ userId, user }) {
  const navigate = useNavigate();
  const [transferStatus, setTransferStatus] = useState(null); // Added state to track transfer status
  const handleRedirect = () => {
    navigate("/dashboard");
  }
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(moneyTransferSchema),
    defaultValues: {
      amount: "",
    },
  });
  const onSubmit = async (data) => {
    try {
      const response = await getAccountService.transferMoney({
        to: userId,
        amount: data.amount,
      });
      setTransferStatus(
        `Transfer of Rs ${data.amount} to ${user} is successful`
      ); // Set transfer status to success
    } catch (error) {
      console.error(error);
      setTransferStatus(`Error: ${error.message}`); // Set transfer status to error
    }
  };
  return (
    <>
      {!transferStatus ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <InputBox
                placeholder={"Enter Amount"}
                label={"Amount (in Rs)"}
                type={"number"}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                value={field.value}
                className={
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                }
              />
            )}
          />
          {errors.amount && (
            <span className="text-red-500">{errors.amount.message}</span>
          )}

          <div className="pt-4">
            <Button
              label={"Initiate Transfer"}
              type={"submit"}
              className={
                "justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
              }
            />
          </div>
        </form>
      ) : (
        <div>
          <Card message={transferStatus} className="mt-4" />
          <Button label={"Dashboard"}  type={"button"} onclick={handleRedirect}/>
        </div>
      )}
    </>
  );
}

export default MoneyTransferForm;
