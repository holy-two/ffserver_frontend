import Folder from "./view/Folder.svelte"
import Redirect from "./view/Redirect.svelte"
import Download from "./view/Download.svelte"

export default {
  "/Download/*": Download,
  "/folder": Folder,
  "/folder/*": Folder,
  "*": Redirect
} 