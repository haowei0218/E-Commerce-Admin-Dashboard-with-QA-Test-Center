import {
    Dialog,
    DialogContent,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@base-ui/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CiCircleQuestion } from "react-icons/ci";
import { SetStateAction } from "react";
import { Dispatch } from "react";
import {
    orderStatus,
    paymentStatus,
    shippingStatus,
    updatePaymentStatusResponse,
    updateShippingStatusResponse,
} from "@/type/orders/base.type";
import { FaEdit } from "react-icons/fa";
import { UseMutationResult } from "@tanstack/react-query";
import { updateOrderStatusResponse } from "@/type/orders/base.type";

type statusType = orderStatus | paymentStatus | shippingStatus
type ApiResponseMap = {
    order: updateOrderStatusResponse
    payment: updatePaymentStatusResponse
    shipping: updateShippingStatusResponse
}

type changeStatusDialogProps<T extends statusType, K extends keyof ApiResponseMap> = {
    openControl: boolean
    openController: Dispatch<SetStateAction<boolean>>,
    status: T,
    statusController: Dispatch<SetStateAction<T>>
    statusList: T[]
    type: K;
    changeStatusMutation: UseMutationResult<ApiResponseMap[K], Error, void, unknown>
    color: string
}

export function ChangeStatusDialog<T extends statusType, K extends keyof ApiResponseMap>({
    openControl,
    openController,
    status,
    statusController,
    statusList,
    type,
    changeStatusMutation,
    color

}: changeStatusDialogProps<T, K>) {
    return (
        <Dialog open={openControl} onOpenChange={openController}>
            <Select
                onValueChange={(value) => {
                    openController(true);
                    statusController(
                        value as T,
                    );
                }}
            >
                <SelectTrigger className={`w-100 !h-10 flex justify-center items-center bg-white ${color} hover:text-white font-semibold rounded-xl [&>svg:last-child]:hidden pr-4` }>
                    <FaEdit />
                    <div className="w-25">
                        <span>Edit {type.toUpperCase()} Status</span>
                    </div>
                </SelectTrigger>

                <SelectContent className="bg-white" side="bottom">
                    {statusList.map(
                        (status: orderStatus | paymentStatus | shippingStatus) => (
                            <SelectItem
                                key={status}
                                value={status}
                                className="cursor-pointer capitalize hover:bg-gray-100"
                            >
                                {status}
                            </SelectItem>
                        ),
                    )}
                </SelectContent>
            </Select>

            <DialogContent className="w-120 max-w-[600px] sm:max-w-[600px] h-80 bg-white ">
                <DialogDescription className="flex flex-col items-center mt-5 gap-5">
                    <CiCircleQuestion size={80} className="text-gray-400" />
                    <span className="text-gray-800 text-2xl">Confirm status change</span>
                    <span className="font-medium text-gray-900 text-lg">
                        change the {type} status to <strong>{status}</strong>?
                    </span>
                </DialogDescription>
                <div className="flex justify-center gap-4 items-center">
                    <Button
                        onClick={() => openController(false)}
                        className="w-40 h-10 bg-red-500  hover:bg-red-600 text-white font-bold rounded-xl"
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={async () => {
                            changeStatusMutation.mutate();
                        }}
                        className="w-40 h-10 bg-blue-500  hover:bg-blue-600 text-white font-bold rounded-xl"
                    >
                        {changeStatusMutation.isPending ? "updating..." : "Confirm"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
