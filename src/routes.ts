import Folder from "./view/Folder.svelte"
import Redirect from "./view/Redirect.svelte"

export default {
  "/folder": Folder,
  "/folder/*": Folder,
  "*": Redirect
} 