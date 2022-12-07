import { tr, td, a } from "../dom/dom";
import { IVehicle } from "../models/vehicle";
import { IType, IStatus } from "../models/maintypes";

export function createOverviewRow(extendedVehicle: IVehicle & IType & IStatus) {
    const row = tr({},
        td({}, extendedVehicle.id),
        td({}, extendedVehicle.type),
        td({}, extendedVehicle.make),
        td({}, extendedVehicle.model),
        td({}, `$${extendedVehicle.rentalPrice.toString()}/day`),
        td({}, extendedVehicle.status),
        td({}, a({ href: `/details.html?id=${extendedVehicle.id}` }, "Details"))
    );

    return row;
}