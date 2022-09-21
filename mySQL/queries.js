const queries = {
  addEmail: function (email) {
    return `INSERT IGNORE INTO emails (id, email, entry_date) 
                VALUES (NULL, "${email}", current_timestamp());`;
  },
  addName: function (name, email_id) {
    return `INSERT INTO names (email_id, name, entry_date) 
                VALUES (${email_id}, "${name}", current_timestamp());`;
  },
  addMessage: function (message, email_id) {
    return `INSERT INTO messages (email_id, message, entry_date) 
                VALUES (${email_id}, "${message}", current_timestamp());`;
  },
  getEmailId: function (email) {
    return `SELECT emails.id 
                FROM emails
                    WHERE emails.email = "${email}"`;
  },
  getAllData: function (id) {
    return `SELECT emails.id, email, name, message, emails.entry_date
                FROM emails
                    LEFT JOIN names
                        ON emails.id = names.email_id
                            LEFT JOIN messages
                                ON emails.id = messages.email_id
                                  WHERE emails.id = ${id};`;
  },
};

module.exports = queries;
