using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Net;
using System.Text;
using System.Web.Script.Serialization;
using System.Windows.Forms;

namespace PesuEmailConfig
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            EnsureBackendRunning();

            AuthForm auth = new AuthForm();
            if (auth.ShowDialog() == DialogResult.OK)
            {
                Application.Run(new EmailConfigWindow());
            }
        }

        static void EnsureBackendRunning()
        {
            try
            {
                using (WebClient client = new WebClient())
                {
                    client.DownloadString("http://localhost:8081/api/email/config");
                }
            }
            catch
            {
                try
                {
                    string baseDir = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, ".."));
                    string serverScript = Path.Combine(baseDir, "server", "admin-server.js");
                    if (File.Exists(serverScript))
                    {
                        ProcessStartInfo psi = new ProcessStartInfo("node", "\"" + serverScript + "\"");
                        psi.WorkingDirectory = baseDir;
                        psi.UseShellExecute = false;
                        psi.CreateNoWindow = true;
                        Process.Start(psi);
                        System.Threading.Thread.Sleep(1200);
                    }
                }
                catch { }
            }
        }
    }

    // =========================================================================
    // Auth Form (Admin Password Required)
    // =========================================================================
    public class AuthForm : Form
    {
        private TextBox txtPass;
        private Label lblError;

        public AuthForm()
        {
            this.Text = "PESU Sports — Email Agent Access";
            this.Size = new Size(420, 290);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.BackColor = Color.FromArgb(245, 244, 239);
            this.Font = new Font("Segoe UI", 9F);

            Panel pnlHeader = new Panel();
            pnlHeader.Dock = DockStyle.Top;
            pnlHeader.Height = 70;
            pnlHeader.BackColor = Color.FromArgb(26, 38, 57);

            Label lblTitle = new Label();
            lblTitle.Text = "EMAIL AGENT CONFIGURATION";
            lblTitle.Font = new Font("Georgia", 11F, FontStyle.Bold);
            lblTitle.ForeColor = Color.White;
            lblTitle.Location = new Point(20, 16);
            lblTitle.AutoSize = true;
            pnlHeader.Controls.Add(lblTitle);

            Label lblSub = new Label();
            lblSub.Text = "Enter master password to access server sending credentials";
            lblSub.ForeColor = Color.FromArgb(196, 85, 36);
            lblSub.Location = new Point(22, 40);
            lblSub.AutoSize = true;
            pnlHeader.Controls.Add(lblSub);

            this.Controls.Add(pnlHeader);

            Label lblPrompt = new Label();
            lblPrompt.Text = "Admin Password (default: 123):";
            lblPrompt.Location = new Point(32, 90);
            lblPrompt.AutoSize = true;
            this.Controls.Add(lblPrompt);

            txtPass = new TextBox();
            txtPass.PasswordChar = '•';
            txtPass.Text = "123";
            txtPass.Location = new Point(32, 112);
            txtPass.Size = new Size(340, 24);
            this.Controls.Add(txtPass);

            lblError = new Label();
            lblError.ForeColor = Color.FromArgb(180, 40, 30);
            lblError.Location = new Point(32, 142);
            lblError.Size = new Size(340, 20);
            this.Controls.Add(lblError);

            Button btnLogin = new Button();
            btnLogin.Text = "Authorize Access";
            btnLogin.Location = new Point(32, 170);
            btnLogin.Size = new Size(340, 36);
            btnLogin.BackColor = Color.FromArgb(196, 85, 36);
            btnLogin.ForeColor = Color.White;
            btnLogin.FlatStyle = FlatStyle.Flat;
            btnLogin.FlatAppearance.BorderSize = 0;
            btnLogin.Font = new Font("Segoe UI", 9.5F, FontStyle.Bold);
            btnLogin.Click += (s, e) =>
            {
                if (txtPass.Text.Trim() == "123")
                {
                    this.DialogResult = DialogResult.OK;
                    this.Close();
                }
                else
                {
                    lblError.Text = "Incorrect admin password (expected: 123).";
                }
            };
            this.Controls.Add(btnLogin);
            this.AcceptButton = btnLogin;
        }
    }

    // =========================================================================
    // Main Email Configuration Window
    // =========================================================================
    public class EmailConfigWindow : Form
    {
        private TextBox txtAdminEmail;
        private TextBox txtSenderName;
        private TextBox txtSmtpHost;
        private TextBox txtSmtpPort;
        private TextBox txtPassword;
        private CheckBox chkSsl;

        // Triggers
        private CheckBox chkReminder;
        private CheckBox chkSlotFreed;
        private CheckBox chkQueueCleared;

        private Label lblAgentStatus;
        private ListBox lstLogs;
        private JavaScriptSerializer jss = new JavaScriptSerializer();
        private const string API_URL = "http://localhost:8081/api/email";

        public EmailConfigWindow()
        {
            this.Text = "PES University Sports — Email Configuration & Sending Agent";
            this.Size = new Size(880, 720);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.BackColor = Color.FromArgb(245, 244, 239);
            this.Font = new Font("Segoe UI", 9F);

            // Header Banner
            Panel pnlHeader = new Panel();
            pnlHeader.Dock = DockStyle.Top;
            pnlHeader.Height = 75;
            pnlHeader.BackColor = Color.FromArgb(26, 38, 57);

            Label title = new Label();
            title.Text = "PESU ATHLETICS EMAIL SERVER AGENT";
            title.ForeColor = Color.White;
            title.Font = new Font("Georgia", 13F, FontStyle.Bold);
            title.Location = new Point(24, 14);
            title.AutoSize = true;
            pnlHeader.Controls.Add(title);

            lblAgentStatus = new Label();
            lblAgentStatus.Text = "Agent Status: Initializing connection to locked vault...";
            lblAgentStatus.ForeColor = Color.FromArgb(170, 200, 240);
            lblAgentStatus.Font = new Font("Segoe UI", 8.5F);
            lblAgentStatus.Location = new Point(26, 42);
            lblAgentStatus.AutoSize = true;
            pnlHeader.Controls.Add(lblAgentStatus);

            this.Controls.Add(pnlHeader);

            // Main Layout Container
            Panel pnlBody = new Panel();
            pnlBody.Dock = DockStyle.Fill;
            pnlBody.AutoScroll = true;
            pnlBody.Padding = new Padding(24);
            this.Controls.Add(pnlBody);

            int y = 20;

            // Group: SMTP Server Credentials
            GroupBox grpSmtp = new GroupBox();
            grpSmtp.Text = " Admin Email Credentials & SMTP Server ";
            grpSmtp.Font = new Font("Segoe UI", 9.5F, FontStyle.Bold);
            grpSmtp.Location = new Point(24, y);
            grpSmtp.Size = new Size(810, 240);
            grpSmtp.BackColor = Color.White;
            pnlBody.Controls.Add(grpSmtp);

            int gy = 28;
            AddLabel(grpSmtp, "Admin Mail ID (Functions as Server Sending Agent):", 20, gy);
            txtAdminEmail = AddTextBox(grpSmtp, "sportsdesk@pesu.pes.edu", 20, gy + 20, 370);

            AddLabel(grpSmtp, "Sender Display Name:", 415, gy);
            txtSenderName = AddTextBox(grpSmtp, "PES University Sports Clearance Office", 415, gy + 20, 370);
            gy += 60;

            AddLabel(grpSmtp, "SMTP Host (e.g. smtp.gmail.com or mail.pes.edu):", 20, gy);
            txtSmtpHost = AddTextBox(grpSmtp, "smtp.gmail.com", 20, gy + 20, 370);

            AddLabel(grpSmtp, "SMTP Port:", 415, gy);
            txtSmtpPort = AddTextBox(grpSmtp, "587", 415, gy + 20, 120);

            chkSsl = new CheckBox();
            chkSsl.Text = "Use SSL / TLS Encryption";
            chkSsl.Location = new Point(560, gy + 20);
            chkSsl.Size = new Size(220, 24);
            chkSsl.Checked = false;
            grpSmtp.Controls.Add(chkSsl);
            gy += 60;

            AddLabel(grpSmtp, "Admin App Password / SMTP Password:", 20, gy);
            txtPassword = AddTextBox(grpSmtp, "", 20, gy + 20, 370);
            txtPassword.PasswordChar = '•';

            Button btnTogglePass = new Button();
            btnTogglePass.Text = "👁 Show";
            btnTogglePass.Location = new Point(395, gy + 19);
            btnTogglePass.Size = new Size(70, 26);
            btnTogglePass.Click += (s, e) =>
            {
                if (txtPassword.PasswordChar == '•')
                {
                    txtPassword.PasswordChar = '\0';
                    btnTogglePass.Text = "Hide";
                }
                else
                {
                    txtPassword.PasswordChar = '•';
                    btnTogglePass.Text = "👁 Show";
                }
            };
            grpSmtp.Controls.Add(btnTogglePass);

            Label lblNote = new Label();
            lblNote.Text = "(Stored in locked_storage/email_config.json with master encryption)";
            lblNote.Font = new Font("Segoe UI", 8F, FontStyle.Italic);
            lblNote.ForeColor = Color.FromArgb(120, 120, 120);
            lblNote.Location = new Point(480, gy + 24);
            lblNote.AutoSize = true;
            grpSmtp.Controls.Add(lblNote);

            y += 260;

            // Group: Automated Notification Triggers
            GroupBox grpTriggers = new GroupBox();
            grpTriggers.Text = " Automated Server Notification Triggers (Functions as Stated in System Specs) ";
            grpTriggers.Font = new Font("Segoe UI", 9.5F, FontStyle.Bold);
            grpTriggers.Location = new Point(24, y);
            grpTriggers.Size = new Size(810, 130);
            grpTriggers.BackColor = Color.White;
            pnlBody.Controls.Add(grpTriggers);

            chkReminder = new CheckBox();
            chkReminder.Text = "✔ Remind student whenever a court booking time comes close (1 hour prior alert)";
            chkReminder.Location = new Point(20, 30);
            chkReminder.Size = new Size(760, 24);
            chkReminder.Checked = true;
            grpTriggers.Controls.Add(chkReminder);

            chkQueueCleared = new CheckBox();
            chkQueueCleared.Text = "✔ Automatically notify waitlisted student when any booking slot in a queue has CLEARED up!";
            chkQueueCleared.Location = new Point(20, 60);
            chkQueueCleared.Size = new Size(760, 24);
            chkQueueCleared.ForeColor = Color.FromArgb(16, 120, 60);
            chkQueueCleared.Checked = true;
            grpTriggers.Controls.Add(chkQueueCleared);

            chkSlotFreed = new CheckBox();
            chkSlotFreed.Text = "✔ Broadcast alert when any court booking slot is cancelled and becomes free for reservation";
            chkSlotFreed.Location = new Point(20, 90);
            chkSlotFreed.Size = new Size(760, 24);
            chkSlotFreed.Checked = true;
            grpTriggers.Controls.Add(chkSlotFreed);

            y += 145;

            // Action Buttons
            Button btnSave = new Button();
            btnSave.Text = "💾 Save Configuration to Vault";
            btnSave.Location = new Point(24, y);
            btnSave.Size = new Size(240, 38);
            btnSave.BackColor = Color.FromArgb(196, 85, 36);
            btnSave.ForeColor = Color.White;
            btnSave.FlatStyle = FlatStyle.Flat;
            btnSave.FlatAppearance.BorderSize = 0;
            btnSave.Font = new Font("Segoe UI", 9.5F, FontStyle.Bold);
            btnSave.Cursor = Cursors.Hand;
            btnSave.Click += BtnSave_Click;
            pnlBody.Controls.Add(btnSave);

            Button btnTest = new Button();
            btnTest.Text = "✉ Send Test Alert from Admin Mail";
            btnTest.Location = new Point(275, y);
            btnTest.Size = new Size(270, 38);
            btnTest.BackColor = Color.FromArgb(26, 38, 57);
            btnTest.ForeColor = Color.White;
            btnTest.FlatStyle = FlatStyle.Flat;
            btnTest.FlatAppearance.BorderSize = 0;
            btnTest.Font = new Font("Segoe UI", 9.5F, FontStyle.Bold);
            btnTest.Cursor = Cursors.Hand;
            btnTest.Click += BtnTest_Click;
            pnlBody.Controls.Add(btnTest);

            Button btnRefreshLogs = new Button();
            btnRefreshLogs.Text = "↻ Refresh Live Logs";
            btnRefreshLogs.Location = new Point(555, y);
            btnRefreshLogs.Size = new Size(160, 38);
            btnRefreshLogs.BackColor = Color.FromArgb(80, 95, 115);
            btnRefreshLogs.ForeColor = Color.White;
            btnRefreshLogs.FlatStyle = FlatStyle.Flat;
            btnRefreshLogs.FlatAppearance.BorderSize = 0;
            btnRefreshLogs.Click += (s, e) => LoadLogs();
            pnlBody.Controls.Add(btnRefreshLogs);

            y += 50;

            // Dispatch Activity Log
            Label lblLogTitle = new Label();
            lblLogTitle.Text = "Server Email Dispatch Log (Real-time Dispatches & Alerts):";
            lblLogTitle.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            lblLogTitle.Location = new Point(24, y);
            lblLogTitle.AutoSize = true;
            pnlBody.Controls.Add(lblLogTitle);

            y += 24;

            lstLogs = new ListBox();
            lstLogs.Location = new Point(24, y);
            lstLogs.Size = new Size(810, 120);
            lstLogs.Font = new Font("Consolas", 8.5F);
            lstLogs.BackColor = Color.FromArgb(250, 250, 248);
            pnlBody.Controls.Add(lstLogs);

            this.Load += (s, e) =>
            {
                LoadConfiguration();
                LoadLogs();
            };
        }

        private void AddLabel(Control parent, string text, int x, int y)
        {
            Label lbl = new Label();
            lbl.Text = text;
            lbl.Font = new Font("Segoe UI", 9F, FontStyle.Regular);
            lbl.Location = new Point(x, y);
            lbl.AutoSize = true;
            parent.Controls.Add(lbl);
        }

        private TextBox AddTextBox(Control parent, string text, int x, int y, int width)
        {
            TextBox tb = new TextBox();
            tb.Text = text;
            tb.Font = new Font("Segoe UI", 9F, FontStyle.Regular);
            tb.Location = new Point(x, y);
            tb.Size = new Size(width, 24);
            parent.Controls.Add(tb);
            return tb;
        }

        private void LoadConfiguration()
        {
            try
            {
                using (WebClient client = new WebClient())
                {
                    client.Encoding = Encoding.UTF8;
                    string res = client.DownloadString(API_URL + "/config");
                    var data = jss.Deserialize<Dictionary<string, object>>(res);

                    if (data.ContainsKey("adminEmail")) txtAdminEmail.Text = Convert.ToString(data["adminEmail"]);
                    if (data.ContainsKey("senderName")) txtSenderName.Text = Convert.ToString(data["senderName"]);
                    if (data.ContainsKey("smtpHost")) txtSmtpHost.Text = Convert.ToString(data["smtpHost"]);
                    if (data.ContainsKey("smtpPort")) txtSmtpPort.Text = Convert.ToString(data["smtpPort"]);
                    if (data.ContainsKey("secure")) chkSsl.Checked = Convert.ToBoolean(data["secure"]);

                    if (data.ContainsKey("auth"))
                    {
                        var auth = (Dictionary<string, object>)data["auth"];
                        if (auth.ContainsKey("pass")) txtPassword.Text = Convert.ToString(auth["pass"]);
                    }

                    if (data.ContainsKey("triggers"))
                    {
                        var trg = (Dictionary<string, object>)data["triggers"];
                        if (trg.ContainsKey("bookingReminder")) chkReminder.Checked = Convert.ToBoolean(trg["bookingReminder"]);
                        if (trg.ContainsKey("slotFreed")) chkSlotFreed.Checked = Convert.ToBoolean(trg["slotFreed"]);
                        if (trg.ContainsKey("queueCleared")) chkQueueCleared.Checked = Convert.ToBoolean(trg["queueCleared"]);
                    }

                    lblAgentStatus.Text = string.Format("Active Agent Mail ID: {0} | Vault Storage: locked_storage/email_config.json", txtAdminEmail.Text);
                }
            }
            catch (Exception ex)
            {
                lblAgentStatus.Text = "Status: Backend offline or config error: " + ex.Message;
            }
        }

        private void BtnSave_Click(object sender, EventArgs e)
        {
            try
            {
                var payload = new Dictionary<string, object>
                {
                    { "adminEmail", txtAdminEmail.Text.Trim() },
                    { "senderName", txtSenderName.Text.Trim() },
                    { "smtpHost", txtSmtpHost.Text.Trim() },
                    { "smtpPort", int.Parse(txtSmtpPort.Text.Trim()) },
                    { "secure", chkSsl.Checked },
                    { "auth", new Dictionary<string, object> {
                        { "user", txtAdminEmail.Text.Trim() },
                        { "pass", txtPassword.Text }
                    }},
                    { "triggers", new Dictionary<string, object> {
                        { "bookingReminder", chkReminder.Checked },
                        { "slotFreed", chkSlotFreed.Checked },
                        { "queueCleared", chkQueueCleared.Checked }
                    }}
                };

                using (WebClient client = new WebClient())
                {
                    client.Headers[HttpRequestHeader.ContentType] = "application/json";
                    client.UploadString(API_URL + "/config", jss.Serialize(payload));
                    MessageBox.Show("Email Configuration securely saved into locked vault!", "Configuration Saved", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    LoadConfiguration();
                    LoadLogs();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error saving configuration: " + ex.Message);
            }
        }

        private void BtnTest_Click(object sender, EventArgs e)
        {
            string target = txtAdminEmail.Text.Trim();
            if (string.IsNullOrEmpty(target))
            {
                MessageBox.Show("Please enter an Admin Mail ID first.");
                return;
            }

            try
            {
                using (WebClient client = new WebClient())
                {
                    client.Headers[HttpRequestHeader.ContentType] = "application/json";
                    string payload = jss.Serialize(new Dictionary<string, object> { { "targetEmail", target } });
                    string res = client.UploadString(API_URL + "/test", payload);
                    var dict = jss.Deserialize<Dictionary<string, object>>(res);

                    if (dict.ContainsKey("success") && Convert.ToBoolean(dict["success"]))
                    {
                        bool sim = dict.ContainsKey("simulated") && Convert.ToBoolean(dict["simulated"]);
                        if (sim)
                        {
                            MessageBox.Show("Test Alert simulated and logged successfully!\n(To send live emails over internet, supply valid SMTP app password)", "Test Dispatched", MessageBoxButtons.OK, MessageBoxIcon.Information);
                        }
                        else
                        {
                            MessageBox.Show("Live Test Email sent to " + target + " successfully!", "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
                        }
                        LoadLogs();
                    }
                    else
                    {
                        MessageBox.Show("Failed to send test email: " + (dict.ContainsKey("error") ? dict["error"] : "Unknown error"));
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error dispatching test email: " + ex.Message);
            }
        }

        private void LoadLogs()
        {
            try
            {
                using (WebClient client = new WebClient())
                {
                    string res = client.DownloadString(API_URL + "/logs");
                    var list = jss.Deserialize<System.Collections.ArrayList>(res);
                    lstLogs.Items.Clear();
                    if (list != null)
                    {
                        foreach (object obj in list)
                        {
                            var entry = obj as Dictionary<string, object>;
                            if (entry == null) continue;
                            string time = Convert.ToString(entry["timestamp"]);
                            string type = Convert.ToString(entry["type"]);
                            string to = Convert.ToString(entry["recipient"]);
                            string details = Convert.ToString(entry["details"]);
                            string timeShort = time.Length >= 19 ? time.Substring(11, 8) : time;
                            lstLogs.Items.Add(string.Format("[{0}] [{1}] {2} -> {3}", timeShort, type, to, details));
                        }
                    }
                    if (lstLogs.Items.Count == 0)
                    {
                        lstLogs.Items.Add("(No email events logged yet. Dispatches will appear here in real time)");
                    }
                }
            }
            catch { }
        }
    }
}
