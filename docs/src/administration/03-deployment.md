# Deployment

Once you have Threadlight running on your computer, you will probably want to make it available for other people to visit. This page walks through the common ways to turn your local server into a real public space that your community can reach from anywhere.

## Running Threadlight as a System Service

The most reliable way to run Threadlight in production is to register it as a system service. This means the operating system itself keeps an eye on the server and starts it automatically whenever the computer boots up. If the server ever crashes for any reason, the system notices right away and starts it again. You do not have to log in and run anything by hand.

To set this up, you create a plain text file called a service unit. This file tells the operating system what program to run, which folder to run it from, and how to behave if the program stops. You give the service a name like threadlight, and you point it to the Threadlight binary you built earlier. You also tell it to load your configuration from a dotenv file that lives next to the binary. Once this file is in place, you ask the system to enable the service, which means register it to start on boot, and then start it right now. From that moment on, Threadlight runs in the background, waking up when your computer does and staying up until you tell it to stop.

## Making Threadlight Reachable from the Internet

Your Threadlight server is now running and listening for visitors, but it is probably only reachable from inside your own home network. To let people from the wider internet connect, you have a few choices. Which one works best depends on whether your internet provider gives you a public address that the whole internet can see.

### Option One: Direct Connection Using a Public Address

If your server has its own public internet address, the path is straightforward. You register a domain name, which is a friendly name like yourcommunity dot example dot com, and point it to your servers address. Then you set up a tool called a reverse proxy, which sits in front of Threadlight and handles secure connections for you. The reverse proxy takes care of the complicated parts of web security, like encrypting all the traffic between your visitors browsers and your server using something called SSL certificates. You can get these certificates for free from an organization called Let's Encrypt. Once the reverse proxy is configured, you forward one specific port from your home router to your Threadlight server, and your community can reach the server by typing your domain name into their browser.

### Option Two: Using a Tunnel for Home Servers

If your server lives on a home network and does not have a public address, you can use a tunnel service like the one offered by Cloudflare. A tunnel creates a secure pathway between your server and the Cloudflare network, so visitors connect to Cloudflare and Cloudflare forwards their requests to your server through the tunnel. This is a great choice for small computers like single board devices that sit on your desk at home.

Setting up a tunnel involves downloading a small program called the tunnel client, authenticating it with your Cloudflare account, and then creating a tunnel with a name that makes sense to you, like threadlight. You then create a configuration file that tells the tunnel which web addresses to forward to which services on your computer. For example, you might tell it that visits to threadlight dot yourdomain dot com should go to your Threadlight server, and visits to docs dot yourdomain dot com should go to the documentation server if you run one separately. After that, you add DNS records that connect your domain name to the tunnel, and finally you install the tunnel client as a system service so it starts automatically just like Threadlight does.

Once the tunnel is running, your Threadlight server is accessible at whatever domain name you chose, even though it is sitting on a home network with no public address. The tunnel handles all the encryption and security automatically.

## Serving Documentation on a Separate Address

If you want to offer the Threadlight documentation at a separate address like docs dot yourdomain dot com, you can run a small static file server alongside Threadlight. You copy the documentation files to a folder on your server and use a simple file server program to make them available on a different port. Then you add a rule to your tunnel or reverse proxy configuration that directs traffic for that subdomain to the documentation server instead of Threadlight. Both services can run side by side without interfering with each other.

## Running Threadlight in a Container

Some people prefer to run applications inside lightweight containers that package the application together with everything it needs to run. Threadlight can absolutely run this way. You would create a container image that starts from a Go build environment, compiles the Threadlight source code, and then copies the finished binary into a smaller, clean container image. The container image also includes any frontend files and documentation that Threadlight serves. Running Threadlight in a container gives you a portable, self contained unit that you can deploy to any server that supports containers, and it makes updates very predictable because the entire environment is defined in the container configuration.

## Keeping Your Community Safe

Before you open your server to the public, there are a few things worth checking. Make sure your JWT secret is set to a strong, random value that nobody can guess. Use a strong password for your database. Make sure every connection between visitors and your server is encrypted using HTTPS, which the reverse proxy or tunnel will handle for you. Keep your server and all its dependencies up to date with the latest security patches. Set up regular database backups so you never lose your community's content. And keep an eye on how much disk space, memory, and processing power your server is using, so you can catch problems before they affect your visitors. These simple habits go a long way toward keeping your Threadlight community safe and welcoming.
