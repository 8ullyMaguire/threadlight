
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/private';
 * 
 * console.log(ENVIRONMENT); // => "production"
 * console.log(PUBLIC_BASE_URL); // => throws error during build
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/private' {
	export const SHELL: string;
	export const npm_command: string;
	export const LSCOLORS: string;
	export const SESSION_MANAGER: string;
	export const WINDOWID: string;
	export const LOCALPRO: string;
	export const LESSHISTFILE: string;
	export const ZEPH_COMPATIBLE_NOUS_API_KEY: string;
	export const JUPYTER_CONFIG_DIR: string;
	export const COLORTERM: string;
	export const BUNDLE_USER_PLUGIN: string;
	export const XDG_CONFIG_DIRS: string;
	export const npm_config_cache: string;
	export const PYTHONUNBUFFERED: string;
	export const LESS: string;
	export const XDG_SESSION_PATH: string;
	export const XDG_MENU_PREFIX: string;
	export const TERMINAL_DOCKER_FORWARD_ENV: string;
	export const TERM_PROGRAM_VERSION: string;
	export const GITRC: string;
	export const TMUX: string;
	export const ZSH_CACHE_DIR: string;
	export const MASTODON_IEJI_ACCESS_TOKEN: string;
	export const TERMINAL_CONTAINER_CPU: string;
	export const HISTSIZE: string;
	export const ICEAUTHORITY: string;
	export const LEMMY_USERNAME: string;
	export const DOT: string;
	export const READER: string;
	export const NODE: string;
	export const ACKRC: string;
	export const VSSCRIPT_PATH: string;
	export const FORGEJO_PASSWORD: string;
	export const TERMINAL_ENV: string;
	export const LC_ADDRESS: string;
	export const MASTODON_IEJI_USERNAME: string;
	export const LEMMY_PASSWORD: string;
	export const PSQL_HISTORY: string;
	export const SCREENSHOT: string;
	export const LC_NAME: string;
	export const FORGEJO_USERNAME: string;
	export const TODOTXT_CFG_FILE: string;
	export const XDG_DATA_HOME: string;
	export const MACHINE_STORAGE_PATH: string;
	export const FORGEJO_INSTANCE: string;
	export const TERMINAL_DOCKER_EXTRA_ARGS: string;
	export const XDG_CONFIG_HOME: string;
	export const MEMORY_PRESSURE_WRITE: string;
	export const RIPGREP_CONFIG_PATH: string;
	export const MASTODON_IEJI_INSTANCE: string;
	export const COLOR: string;
	export const npm_config_local_prefix: string;
	export const LEMMY_URL: string;
	export const AZURACAST_EMAIL: string;
	export const TERMINAL_CONTAINER_MEMORY: string;
	export const GNUPGHOME: string;
	export const DESKTOP_SESSION: string;
	export const LC_MONETARY: string;
	export const OLLAMA_MODELS: string;
	export const GTK_RC_FILES: string;
	export const npm_config_globalconfig: string;
	export const CONDA_CHANGEPS1: string;
	export const EDITOR: string;
	export const LOCALRC: string;
	export const GOBIN: string;
	export const SCREENRC: string;
	export const XDG_SEAT: string;
	export const PWD: string;
	export const UNISON: string;
	export const LOGNAME: string;
	export const XDG_SESSION_DESKTOP: string;
	export const HERMES_REAL_HOME: string;
	export const XDG_SESSION_TYPE: string;
	export const BSKY_EN_APP_PASSWORD: string;
	export const BROWSER_SESSION_TIMEOUT: string;
	export const npm_config_init_module: string;
	export const WEB_TOOLS_DEBUG: string;
	export const PGPASSFILE: string;
	export const SYSTEMD_EXEC_PID: string;
	export const npm_config_tmp: string;
	export const AZURACAST_URL: string;
	export const MASTODON_IEJI_PASSWORD: string;
	export const MASTODON_PASSWORD: string;
	export const _: string;
	export const XAUTHORITY: string;
	export const IPYTHONDIR: string;
	export const ZSH_TMUX_CONFIG: string;
	export const MOTD_SHOWN: string;
	export const GTK2_RC_FILES: string;
	export const HOME: string;
	export const PIEFED_PASSWORD: string;
	export const IMAGE_TOOLS_DEBUG: string;
	export const MUTT: string;
	export const LANG: string;
	export const LC_PAPER: string;
	export const HERMES_SESSION_ID: string;
	export const NPM_BIN: string;
	export const MASTODON_INSTANCE: string;
	export const BUNDLE_USER_CONFIG: string;
	export const WINEPREFIX: string;
	export const HISTFILE: string;
	export const LS_COLORS: string;
	export const _JAVA_AWT_WM_NONREPARENTING: string;
	export const CARGO_HOME: string;
	export const XDG_CURRENT_DESKTOP: string;
	export const PIEFED_COMMUNITY: string;
	export const QUESTIONABLE_QUESTING_USERNAME: string;
	export const npm_package_version: string;
	export const CONFIG_DIR: string;
	export const _ZSH_TMUX_FIXED_CONFIG: string;
	export const MASTODON_ACCESS_TOKEN: string;
	export const TERMINAL_DOCKER_RUN_AS_HOST_USER: string;
	export const MEMORY_PRESSURE_WATCH: string;
	export const TERMINAL_CONTAINER_DISK: string;
	export const KEYTIMEOUT: string;
	export const VIM_DIR: string;
	export const WAYLAND_DISPLAY: string;
	export const PEERTUBE_INSTANCE: string;
	export const VIRTUAL_ENV_DISABLE_PROMPT: string;
	export const HERMES_KANBAN_BOARD: string;
	export const XDG_SEAT_PATH: string;
	export const TERMINAL_TIMEOUT: string;
	export const INVOCATION_ID: string;
	export const ZEPH_HOME: string;
	export const CHOOSENIM_DIR: string;
	export const SAVEHIST: string;
	export const WGETRC: string;
	export const MANAGERPID: string;
	export const INIT_CWD: string;
	export const ATOM_HOME: string;
	export const BROWSERBASE_PROXIES: string;
	export const GEM_SPEC_CACHE: string;
	export const ODYSEE_EN_CHANNEL_ID: string;
	export const ZSH_COMPDUMP: string;
	export const KDE_SESSION_UID: string;
	export const VISION_TOOLS_DEBUG: string;
	export const XDG_CACHE_HOME: string;
	export const ALACRITTY_SOCKET: string;
	export const BUNDLE_USER_CACHE: string;
	export const npm_lifecycle_script: string;
	export const HERMES_QUIET: string;
	export const NVM_DIR: string;
	export const XKB_DEFAULT_LAYOUT: string;
	export const GRADLE_USER_HOME: string;
	export const npm_config_npm_version: string;
	export const GEM_HOME: string;
	export const NPM_CONFIG_PREFIX: string;
	export const NSS_USER_PKI: string;
	export const XDG_SESSION_CLASS: string;
	export const BROWSER_INACTIVITY_TIMEOUT: string;
	export const LC_IDENTIFICATION: string;
	export const TERM: string;
	export const TERMINFO: string;
	export const SYNC: string;
	export const npm_package_name: string;
	export const ZSH: string;
	export const BSKY_APP_PASSWORD: string;
	export const RUSTUP_HOME: string;
	export const ZDOTDIR: string;
	export const PSQLRC: string;
	export const USER: string;
	export const VIM_TMP: string;
	export const MYSQL_HISTFILE: string;
	export const NPM_PATH: string;
	export const TERMINAL_SINGULARITY_IMAGE: string;
	export const TMUX_PANE: string;
	export const PEERTUBE_PASSWORD: string;
	export const ZSH_CUSTOM: string;
	export const QT_WAYLAND_RECONNECT: string;
	export const KDE_SESSION_VERSION: string;
	export const PAM_KWALLET5_LOGIN: string;
	export const NPM_CONFIG_USERCONFIG: string;
	export const QUESTIONABLE_QUESTING_SITE: string;
	export const XINITRC: string;
	export const VISUAL: string;
	export const PROMPT_EOL_MARK: string;
	export const DISPLAY: string;
	export const npm_lifecycle_event: string;
	export const SHLVL: string;
	export const INPUTRC: string;
	export const GIT_EDITOR: string;
	export const PAGER: string;
	export const HERMES_INTERACTIVE: string;
	export const LC_TELEPHONE: string;
	export const PEERTUBE_USERNAME: string;
	export const LC_MEASUREMENT: string;
	export const XDG_VTNR: string;
	export const ANDROID_USER_HOME: string;
	export const TERMINAL_DAYTONA_IMAGE: string;
	export const XDG_SESSION_ID: string;
	export const TERMINAL_MODAL_IMAGE: string;
	export const TERMINAL_PERSISTENT_SHELL: string;
	export const GOCACHE: string;
	export const MANAGERPIDFDID: string;
	export const npm_config_user_agent: string;
	export const TERMINAL_HOME_MODE: string;
	export const ZPROFILE: string;
	export const TERMINAL_CWD: string;
	export const NUGET_PACKAGES: string;
	export const TERMINFO_DIRS: string;
	export const XDG_STATE_HOME: string;
	export const npm_execpath: string;
	export const ZSHRC: string;
	export const XDG_RUNTIME_DIR: string;
	export const MUTTRC: string;
	export const MYVIMRC: string;
	export const BSKY_HANDLE: string;
	export const TMUXRC: string;
	export const ZSH_TMUX_TERM: string;
	export const DEBUGINFOD_URLS: string;
	export const npm_package_json: string;
	export const LC_TIME: string;
	export const TERMINAL_DOCKER_VOLUMES: string;
	export const VAGRANT_HOME: string;
	export const _Z_DATA: string;
	export const HERMES_REDACT_SECRETS: string;
	export const AZURACAST_PASSWORD: string;
	export const TERMINAL_DOCKER_MOUNT_CWD_TO_WORKSPACE: string;
	export const JOURNAL_STREAM: string;
	export const NODE_REPL_HISTORY: string;
	export const XDG_DATA_DIRS: string;
	export const QUESTIONABLE_QUESTING_PASSWORD: string;
	export const KDE_FULL_SESSION: string;
	export const HERMES_MAX_ITERATIONS: string;
	export const npm_config_allow_scripts: string;
	export const npm_config_noproxy: string;
	export const PATH: string;
	export const npm_config_node_gyp: string;
	export const DOCKER_CONFIG: string;
	export const ODYSEE_USERNAME: string;
	export const ALACRITTY_LOG: string;
	export const PIEFED_USERNAME: string;
	export const NIMBLE_DIR: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const TMUX_DIR: string;
	export const npm_config_global_prefix: string;
	export const PASSWORD_STORE_DIR: string;
	export const BROWSERBASE_ADVANCED_STEALTH: string;
	export const KDE_APPLICATIONS_AS_SCOPE: string;
	export const CONDARC: string;
	export const MAIL: string;
	export const ODYSEE_PASSWORD: string;
	export const TERMINAL_CONTAINER_PERSISTENT: string;
	export const TERMINAL_DOCKER_IMAGE: string;
	export const npm_config_global_ignore_file: string;
	export const MOA_TOOLS_DEBUG: string;
	export const LOCALENV: string;
	export const ALACRITTY_WINDOW_ID: string;
	export const _JAVA_OPTIONS: string;
	export const FORGEJO_TOKEN: string;
	export const TERMINAL_LIFETIME_SECONDS: string;
	export const DOWNLOADS: string;
	export const CODEBERG_TOKEN: string;
	export const XKB_DEFAULT_OPTIONS: string;
	export const MASTODON_USERNAME: string;
	export const npm_node_execpath: string;
	export const LESSKEY: string;
	export const MYPY_CACHE_DIR: string;
	export const LC_NUMERIC: string;
	export const OLDPWD: string;
	export const ZSHENV: string;
	export const GOPATH: string;
	export const TERM_PROGRAM: string;
	export const VAGRANT_ALIAS_FILE: string;
	export const BSKY_EN_HANDLE: string;
	export const NODE_ENV: string;
}

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/public';
 * 
 * console.log(ENVIRONMENT); // => throws error during build
 * console.log(PUBLIC_BASE_URL); // => "http://site.com"
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/public' {
	export const PUBLIC_INSTANCE_URL: string;
	export const PUBLIC_LOCK_TO_INSTANCE: string;
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * 
 * console.log(env.ENVIRONMENT); // => "production"
 * console.log(env.PUBLIC_BASE_URL); // => undefined
 * ```
 */
declare module '$env/dynamic/private' {
	export const env: {
		SHELL: string;
		npm_command: string;
		LSCOLORS: string;
		SESSION_MANAGER: string;
		WINDOWID: string;
		LOCALPRO: string;
		LESSHISTFILE: string;
		ZEPH_COMPATIBLE_NOUS_API_KEY: string;
		JUPYTER_CONFIG_DIR: string;
		COLORTERM: string;
		BUNDLE_USER_PLUGIN: string;
		XDG_CONFIG_DIRS: string;
		npm_config_cache: string;
		PYTHONUNBUFFERED: string;
		LESS: string;
		XDG_SESSION_PATH: string;
		XDG_MENU_PREFIX: string;
		TERMINAL_DOCKER_FORWARD_ENV: string;
		TERM_PROGRAM_VERSION: string;
		GITRC: string;
		TMUX: string;
		ZSH_CACHE_DIR: string;
		MASTODON_IEJI_ACCESS_TOKEN: string;
		TERMINAL_CONTAINER_CPU: string;
		HISTSIZE: string;
		ICEAUTHORITY: string;
		LEMMY_USERNAME: string;
		DOT: string;
		READER: string;
		NODE: string;
		ACKRC: string;
		VSSCRIPT_PATH: string;
		FORGEJO_PASSWORD: string;
		TERMINAL_ENV: string;
		LC_ADDRESS: string;
		MASTODON_IEJI_USERNAME: string;
		LEMMY_PASSWORD: string;
		PSQL_HISTORY: string;
		SCREENSHOT: string;
		LC_NAME: string;
		FORGEJO_USERNAME: string;
		TODOTXT_CFG_FILE: string;
		XDG_DATA_HOME: string;
		MACHINE_STORAGE_PATH: string;
		FORGEJO_INSTANCE: string;
		TERMINAL_DOCKER_EXTRA_ARGS: string;
		XDG_CONFIG_HOME: string;
		MEMORY_PRESSURE_WRITE: string;
		RIPGREP_CONFIG_PATH: string;
		MASTODON_IEJI_INSTANCE: string;
		COLOR: string;
		npm_config_local_prefix: string;
		LEMMY_URL: string;
		AZURACAST_EMAIL: string;
		TERMINAL_CONTAINER_MEMORY: string;
		GNUPGHOME: string;
		DESKTOP_SESSION: string;
		LC_MONETARY: string;
		OLLAMA_MODELS: string;
		GTK_RC_FILES: string;
		npm_config_globalconfig: string;
		CONDA_CHANGEPS1: string;
		EDITOR: string;
		LOCALRC: string;
		GOBIN: string;
		SCREENRC: string;
		XDG_SEAT: string;
		PWD: string;
		UNISON: string;
		LOGNAME: string;
		XDG_SESSION_DESKTOP: string;
		HERMES_REAL_HOME: string;
		XDG_SESSION_TYPE: string;
		BSKY_EN_APP_PASSWORD: string;
		BROWSER_SESSION_TIMEOUT: string;
		npm_config_init_module: string;
		WEB_TOOLS_DEBUG: string;
		PGPASSFILE: string;
		SYSTEMD_EXEC_PID: string;
		npm_config_tmp: string;
		AZURACAST_URL: string;
		MASTODON_IEJI_PASSWORD: string;
		MASTODON_PASSWORD: string;
		_: string;
		XAUTHORITY: string;
		IPYTHONDIR: string;
		ZSH_TMUX_CONFIG: string;
		MOTD_SHOWN: string;
		GTK2_RC_FILES: string;
		HOME: string;
		PIEFED_PASSWORD: string;
		IMAGE_TOOLS_DEBUG: string;
		MUTT: string;
		LANG: string;
		LC_PAPER: string;
		HERMES_SESSION_ID: string;
		NPM_BIN: string;
		MASTODON_INSTANCE: string;
		BUNDLE_USER_CONFIG: string;
		WINEPREFIX: string;
		HISTFILE: string;
		LS_COLORS: string;
		_JAVA_AWT_WM_NONREPARENTING: string;
		CARGO_HOME: string;
		XDG_CURRENT_DESKTOP: string;
		PIEFED_COMMUNITY: string;
		QUESTIONABLE_QUESTING_USERNAME: string;
		npm_package_version: string;
		CONFIG_DIR: string;
		_ZSH_TMUX_FIXED_CONFIG: string;
		MASTODON_ACCESS_TOKEN: string;
		TERMINAL_DOCKER_RUN_AS_HOST_USER: string;
		MEMORY_PRESSURE_WATCH: string;
		TERMINAL_CONTAINER_DISK: string;
		KEYTIMEOUT: string;
		VIM_DIR: string;
		WAYLAND_DISPLAY: string;
		PEERTUBE_INSTANCE: string;
		VIRTUAL_ENV_DISABLE_PROMPT: string;
		HERMES_KANBAN_BOARD: string;
		XDG_SEAT_PATH: string;
		TERMINAL_TIMEOUT: string;
		INVOCATION_ID: string;
		ZEPH_HOME: string;
		CHOOSENIM_DIR: string;
		SAVEHIST: string;
		WGETRC: string;
		MANAGERPID: string;
		INIT_CWD: string;
		ATOM_HOME: string;
		BROWSERBASE_PROXIES: string;
		GEM_SPEC_CACHE: string;
		ODYSEE_EN_CHANNEL_ID: string;
		ZSH_COMPDUMP: string;
		KDE_SESSION_UID: string;
		VISION_TOOLS_DEBUG: string;
		XDG_CACHE_HOME: string;
		ALACRITTY_SOCKET: string;
		BUNDLE_USER_CACHE: string;
		npm_lifecycle_script: string;
		HERMES_QUIET: string;
		NVM_DIR: string;
		XKB_DEFAULT_LAYOUT: string;
		GRADLE_USER_HOME: string;
		npm_config_npm_version: string;
		GEM_HOME: string;
		NPM_CONFIG_PREFIX: string;
		NSS_USER_PKI: string;
		XDG_SESSION_CLASS: string;
		BROWSER_INACTIVITY_TIMEOUT: string;
		LC_IDENTIFICATION: string;
		TERM: string;
		TERMINFO: string;
		SYNC: string;
		npm_package_name: string;
		ZSH: string;
		BSKY_APP_PASSWORD: string;
		RUSTUP_HOME: string;
		ZDOTDIR: string;
		PSQLRC: string;
		USER: string;
		VIM_TMP: string;
		MYSQL_HISTFILE: string;
		NPM_PATH: string;
		TERMINAL_SINGULARITY_IMAGE: string;
		TMUX_PANE: string;
		PEERTUBE_PASSWORD: string;
		ZSH_CUSTOM: string;
		QT_WAYLAND_RECONNECT: string;
		KDE_SESSION_VERSION: string;
		PAM_KWALLET5_LOGIN: string;
		NPM_CONFIG_USERCONFIG: string;
		QUESTIONABLE_QUESTING_SITE: string;
		XINITRC: string;
		VISUAL: string;
		PROMPT_EOL_MARK: string;
		DISPLAY: string;
		npm_lifecycle_event: string;
		SHLVL: string;
		INPUTRC: string;
		GIT_EDITOR: string;
		PAGER: string;
		HERMES_INTERACTIVE: string;
		LC_TELEPHONE: string;
		PEERTUBE_USERNAME: string;
		LC_MEASUREMENT: string;
		XDG_VTNR: string;
		ANDROID_USER_HOME: string;
		TERMINAL_DAYTONA_IMAGE: string;
		XDG_SESSION_ID: string;
		TERMINAL_MODAL_IMAGE: string;
		TERMINAL_PERSISTENT_SHELL: string;
		GOCACHE: string;
		MANAGERPIDFDID: string;
		npm_config_user_agent: string;
		TERMINAL_HOME_MODE: string;
		ZPROFILE: string;
		TERMINAL_CWD: string;
		NUGET_PACKAGES: string;
		TERMINFO_DIRS: string;
		XDG_STATE_HOME: string;
		npm_execpath: string;
		ZSHRC: string;
		XDG_RUNTIME_DIR: string;
		MUTTRC: string;
		MYVIMRC: string;
		BSKY_HANDLE: string;
		TMUXRC: string;
		ZSH_TMUX_TERM: string;
		DEBUGINFOD_URLS: string;
		npm_package_json: string;
		LC_TIME: string;
		TERMINAL_DOCKER_VOLUMES: string;
		VAGRANT_HOME: string;
		_Z_DATA: string;
		HERMES_REDACT_SECRETS: string;
		AZURACAST_PASSWORD: string;
		TERMINAL_DOCKER_MOUNT_CWD_TO_WORKSPACE: string;
		JOURNAL_STREAM: string;
		NODE_REPL_HISTORY: string;
		XDG_DATA_DIRS: string;
		QUESTIONABLE_QUESTING_PASSWORD: string;
		KDE_FULL_SESSION: string;
		HERMES_MAX_ITERATIONS: string;
		npm_config_allow_scripts: string;
		npm_config_noproxy: string;
		PATH: string;
		npm_config_node_gyp: string;
		DOCKER_CONFIG: string;
		ODYSEE_USERNAME: string;
		ALACRITTY_LOG: string;
		PIEFED_USERNAME: string;
		NIMBLE_DIR: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		TMUX_DIR: string;
		npm_config_global_prefix: string;
		PASSWORD_STORE_DIR: string;
		BROWSERBASE_ADVANCED_STEALTH: string;
		KDE_APPLICATIONS_AS_SCOPE: string;
		CONDARC: string;
		MAIL: string;
		ODYSEE_PASSWORD: string;
		TERMINAL_CONTAINER_PERSISTENT: string;
		TERMINAL_DOCKER_IMAGE: string;
		npm_config_global_ignore_file: string;
		MOA_TOOLS_DEBUG: string;
		LOCALENV: string;
		ALACRITTY_WINDOW_ID: string;
		_JAVA_OPTIONS: string;
		FORGEJO_TOKEN: string;
		TERMINAL_LIFETIME_SECONDS: string;
		DOWNLOADS: string;
		CODEBERG_TOKEN: string;
		XKB_DEFAULT_OPTIONS: string;
		MASTODON_USERNAME: string;
		npm_node_execpath: string;
		LESSKEY: string;
		MYPY_CACHE_DIR: string;
		LC_NUMERIC: string;
		OLDPWD: string;
		ZSHENV: string;
		GOPATH: string;
		TERM_PROGRAM: string;
		VAGRANT_ALIAS_FILE: string;
		BSKY_EN_HANDLE: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://example.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.ENVIRONMENT); // => undefined, not public
 * console.log(env.PUBLIC_BASE_URL); // => "http://example.com"
 * ```
 * 
 * ```
 * 
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		PUBLIC_INSTANCE_URL: string;
		PUBLIC_LOCK_TO_INSTANCE: string;
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
