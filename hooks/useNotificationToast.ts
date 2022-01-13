import { useNotifications, Notification } from "@usedapp/core";
import { useEffect, useState } from "react";

function getNotificationMessage(type: string) {
  switch (type) {
    case "transactionStarted":
      return "Transaction has started";
    case "transactionFailed":
      return "Transaction has failed";
    case "transactionSucceed":
      return "Transaction has succeeded";
    case "walletConnected":
      return "Wallet Connected";
    default:
      return "";
  }
}

export function useNotificationToast(callback: (text: string) => void): void {
  const { notifications } = useNotifications();
  const [sent, setSent] = useState<Notification[]>([]);

  useEffect(() => {
    if (notifications.length) {
      const newNotifs = notifications.filter((el) => sent.indexOf(el) < 0);
      for (const notif of newNotifs) {
        if ("submittedAt" in notif && notif.submittedAt + 60 > Date.now()) {
          callback(getNotificationMessage(notif.type));
        }
      }
      setSent([...sent, ...newNotifs]);
    }
  }, [notifications]);
}
