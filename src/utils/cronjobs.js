const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const connectionRequest = require("../models/connectionRequest");
const sendEmail = require("../utils/sendEmail");

// Scheduling cron job for sending email to user who got connection request yesterday
// cron.schedule("s(opt) m h d m wd", () => {}); wd : day in week
// will run each day at 08:00 am
cron.schedule("0 8 * * *", async () => {
  try {
    // Getting yesterday's start & end time
    const yesterday = subDays(new Date(), 1);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    // Getting yesterday's pending requests
    const pendingRequests = await connectionRequest
      .find({
        status: "interested",
        createdAt: {
          $gte: yesterdayStart,
          $lt: yesterdayEnd,
        },
      })
      .populate("fromUserId toUserId");

    // Filtering emails
    const listOfEmails = [
      ...new Set(pendingRequests?.map((req) => req?.toUserId?.emailId)),
    ];

    // console.log("listOfEmails : ", listOfEmails);

    for (email of listOfEmails) {
      try {
        const res = await sendEmail.run(
          `New Friend Requests pending for ${email}`,
          "There are so many friend requests pending, please sign in to DevTinder.ltd and accept or reject it. "
        );
        // console.log("email res : ", res);
      } catch (err) {
        console.error("listOfEmails err : ", err);
      }
    }
  } catch (err) {
    console.error("cron err : ", err);
  }
});
