import { LocalStorage } from "./Storage";
import { BodyTypes, Car, IVehicle, Transmissions } from "./vehicle";
import { generateId } from "./utils";
import { Editor } from "./dom/Editor";
import { FormView } from "./views/FormView";
import { EditForm } from "./views/EditForm";
import { getLocation } from "./utils";
import { Table } from "./dom/Table";
import { tr, td, span, button } from "./dom/dom";

let editId = null;

const ls = new LocalStorage();

let isEditing = false;

const actionButton = document.getElementsByClassName("action new")[0] as HTMLButtonElement;
