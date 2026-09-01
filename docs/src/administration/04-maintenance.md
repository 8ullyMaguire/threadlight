# Maintenance

Keeping a Threadlight server healthy does not require a lot of work. The server handles most of its housekeeping automatically, but there are a few things you should do every now and then to make sure everything keeps running smoothly for your community.

## Database Migrations Happen Automatically

Whenever you start or restart Threadlight, the server checks whether its database needs any updates. If you have installed a newer version of Threadlight that expects a slightly different database structure, the server makes those changes itself as it boots up. You never have to run migration commands or worry about whether your database schema is up to date. Just restart the server and Threadlight takes care of the rest.

## Old Content Gets Cleaned Up on Its Own

Threadlight includes a worker that runs once every hour and looks for content that has grown stale. Posts that are older than six months and have received very few likes are removed automatically. This keeps your database from filling up with old posts that nobody is interacting with anymore. If you want, you can adjust the age threshold and the minimum number of likes in the configuration, but the defaults work well for most communities. The idea is that the database holds onto the content that people actually care about and lets go of the rest, keeping the community's shared space tidy without anyone having to clean by hand.

## Backing Up Your Database Regularly

Your PostgreSQL database holds everything your community has created. Losing it would mean losing every post, every connection between members, and every piece of shared history. That is why regular backups are so important.

You can make a backup using a tool called pg_dump, which comes with PostgreSQL. This tool creates a single file that contains a snapshot of your entire database at that moment. You run it by telling it the name of your database and where to save the output file. It is a good idea to include the current date and time in the filename so you know exactly when each backup was made.

To make sure backups happen even when you forget, you can set up a scheduled task on your system that runs the backup command automatically every day. A good time for this is early in the morning when nobody is using the server. The scheduled task calls pg_dump, writes the backup file to a folder you choose, and then cleans up any backup files that are more than a week old so you do not fill up your disk with old copies.

## Restoring from a Backup If Something Goes Wrong

If the worst happens and your database gets corrupted or lost, you can restore it from a backup. To do this, you first create a fresh empty database with the same name as the original one. Then you use a tool called psql, also part of PostgreSQL, to feed your backup file into the new database. Psql reads the backup file and recreates every table, every post, and every user account exactly as they were when the backup was made. After the restore is complete, you restart Threadlight, and your community picks up right where it left off.

## Checking on Your Server's Health

Threadlight is designed to run quietly in the background, but it is still a good idea to check on it from time to time. Watch your disk space, because database files and uploaded images can grow larger than you expect. Keep an eye on memory usage, since both PostgreSQL and Redis like to use available memory for caching. And watch your processor usage, especially if many people are active at once or if your server is processing media files. Your operating system provides tools that show you how much disk space is left, how much memory is being used, and how hard the processor is working. Learning to read these numbers gives you a good sense of when your server might need more resources.

## Viewing the Server Logs

Threadlight writes messages about what it is doing to a stream called standard output. If you set Threadlight up as a system service, you can view these messages using the systems logging tool. The logs show you when the server started, when it processed background tasks, and if anything went wrong. If you ever run into trouble, the logs are the first place to look because Threadlight writes helpful messages that explain what happened.

## Updating Threadlight to a Newer Version

When a new version of Threadlight is released, updating is straightforward. First, make a fresh backup of your database just in case. Then get the latest source code using git, which will download only the changes since your last update. Build the new binary the same way you built the first one. If there were any changes to the web interface, those get built too. Then restart the Threadlight service. When the server starts up again, it runs any new database migrations automatically. That is all there is to it. Your community might not even notice that anything changed, except that the server now has the latest features and fixes.
