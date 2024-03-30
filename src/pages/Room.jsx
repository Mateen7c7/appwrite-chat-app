import { useEffect, useState } from "react";
import {
  COLLECTION_ID_MESSAGES,
  Database_ID,
  client,
  databases,
} from "../appwriteConfig";
import { ID, Query } from "appwrite";
import { Trash2 } from "react-feather";

export const Room = () => {
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");
  const getMessages = async () => {
    const response = await databases.listDocuments(
      Database_ID,
      COLLECTION_ID_MESSAGES,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );
    console.log("Response: ", response);
    setMessages(response.documents);
  };

  useEffect(() => {
    getMessages();
    const subscription = client.subscribe(
      `databases.${Database_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
      (res) => {
        if (
          res.events.includes("databases.*.collections.*.documents.*.create")
        ) {
          console.log("A MESSAGE WAS CREATED");
          setMessages((prevState) => [res.payload, ...prevState]);
        }
        if (
          res.events.includes("databases.*.collections.*.documents.*.delete")
        ) {
          console.log("A MESSAGE WAS DELETED!!!");
          setMessages((prevState) =>
            prevState.filter((message) => message.$id !== res.payload.$id)
          );
        }
      }
    );
    return () => {
      subscription();
    };
  }, []);

  const deleteMessage = async (message_id) => {
    await databases.deleteDocument(
      Database_ID,
      COLLECTION_ID_MESSAGES,
      message_id
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload = {
      body: messageBody,
    };
    const response = await databases.createDocument(
      Database_ID,
      COLLECTION_ID_MESSAGES,
      ID.unique(),
      payload
    );
    console.log("Created!", response);
    // setMessages([response, ...messages]);
    setMessageBody("");
  };

  return (
    <main className="container">
      <div className="room--container">
        <form id="message--form" onSubmit={handleSubmit}>
          <div>
            <textarea
              required
              maxLength="1000"
              placeholder="Say something..."
              onChange={(e) => {
                setMessageBody(e.target.value);
              }}
              value={messageBody}
            ></textarea>
          </div>

          <div className="send-btn--wrapper">
            <input className="btn btn--secondary" type="submit" value="send" />
          </div>
        </form>

        {messages.map((message) => (
          <div className="message--wrapper" key={message.$id}>
            <div className="message--header">
              <small className="message--timestamp">
                {new Date(message.$createdAt).toLocaleString()}
              </small>
              <Trash2
                className="delete--btn"
                onClick={() => deleteMessage(message.$id)}
              >
                X
              </Trash2>
            </div>
            <div className="message--body">
              <span>{message.body}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};
