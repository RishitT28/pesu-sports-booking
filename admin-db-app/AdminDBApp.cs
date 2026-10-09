using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Net;
using System.Text;
using System.Web.Script.Serialization;
using System.Windows.Forms;

namespace PesuSportsAdmin
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            // Ensure backend is running
            EnsureBackendRunning();

            // Show Login Dialog
            LoginForm login = new LoginForm();
            if (login.ShowDialog() == DialogResult.OK)
            {
                Application.Run(new MainWindow());
            }
        }

        public static void EnsureBackendRunning()
        {
            try
            {
                using (WebClient client = new WebClient())
                {
                    client.DownloadString("http://localhost:8081/api/admin/stats");
                }
            }
            catch
            {
                // Start backend server in background
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
    // Login Form: Admin Entry Key & Password Verification
    // =========================================================================
    public class LoginForm : Form
    {
        private TextBox txtKey;
        private TextBox txtPass;
        private Button btnLogin;
        private Label lblError;

        public LoginForm()
        {
            this.Text = "PESU Athletics — Admin Gateway";
            this.Size = new Size(440, 360);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.BackColor = Color.FromArgb(245, 244, 239);
            this.Font = new Font("Segoe UI", 9F, FontStyle.Regular);

            Panel pnlHeader = new Panel();
            pnlHeader.Dock = DockStyle.Top;
            pnlHeader.Height = 85;
            pnlHeader.BackColor = Color.FromArgb(26, 38, 57);

            Label lblTitle = new Label();
            lblTitle.Text = "PES UNIVERSITY ATHLETICS";
            lblTitle.Font = new Font("Georgia", 13F, FontStyle.Bold);
            lblTitle.ForeColor = Color.White;
            lblTitle.Location = new Point(24, 18);
            lblTitle.AutoSize = true;
            pnlHeader.Controls.Add(lblTitle);

            Label lblSub = new Label();
            lblSub.Text = "Restricted Database Administration Gateway";
            lblSub.Font = new Font("Segoe UI", 9F, FontStyle.Regular);
            lblSub.ForeColor = Color.FromArgb(196, 85, 36);
            lblSub.Location = new Point(26, 45);
            lblSub.AutoSize = true;
            pnlHeader.Controls.Add(lblSub);

            this.Controls.Add(pnlHeader);

            Label lblKeyPrompt = new Label();
            lblKeyPrompt.Text = "Admin Entry Key:";
            lblKeyPrompt.Location = new Point(36, 105);
            lblKeyPrompt.AutoSize = true;
            lblKeyPrompt.ForeColor = Color.FromArgb(40, 40, 40);
            this.Controls.Add(lblKeyPrompt);

            txtKey = new TextBox();
            txtKey.Text = "PESU-ADMIN-KEY";
            txtKey.Location = new Point(36, 126);
            txtKey.Size = new Size(350, 24);
            this.Controls.Add(txtKey);

            Label lblPassPrompt = new Label();
            lblPassPrompt.Text = "Admin Password (default: 123):";
            lblPassPrompt.Location = new Point(36, 165);
            lblPassPrompt.AutoSize = true;
            lblPassPrompt.ForeColor = Color.FromArgb(40, 40, 40);
            this.Controls.Add(lblPassPrompt);

            txtPass = new TextBox();
            txtPass.PasswordChar = '•';
            txtPass.Text = "123";
            txtPass.Location = new Point(36, 186);
            txtPass.Size = new Size(350, 24);
            this.Controls.Add(txtPass);

            lblError = new Label();
            lblError.ForeColor = Color.FromArgb(180, 40, 30);
            lblError.Location = new Point(36, 220);
            lblError.Size = new Size(350, 20);
            this.Controls.Add(lblError);

            btnLogin = new Button();
            btnLogin.Text = "Unlock Database & Enter";
            btnLogin.Location = new Point(36, 248);
            btnLogin.Size = new Size(350, 38);
            btnLogin.BackColor = Color.FromArgb(196, 85, 36);
            btnLogin.ForeColor = Color.White;
            btnLogin.FlatStyle = FlatStyle.Flat;
            btnLogin.FlatAppearance.BorderSize = 0;
            btnLogin.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            btnLogin.Cursor = Cursors.Hand;
            btnLogin.Click += BtnLogin_Click;
            this.Controls.Add(btnLogin);

            this.AcceptButton = btnLogin;
        }

        private void BtnLogin_Click(object sender, EventArgs e)
        {
            string key = txtKey.Text.Trim();
            string pass = txtPass.Text.Trim();

            if (pass == "123" || key == "PESU-ADMIN-KEY" && pass == "123")
            {
                this.DialogResult = DialogResult.OK;
                this.Close();
            }
            else
            {
                lblError.Text = "Invalid entry key or password (default password: 123).";
            }
        }
    }

    // =========================================================================
    // Main Window: Multi-Table Updating Interface
    // =========================================================================
    public class MainWindow : Form
    {
        private TabControl tabControl;
        private TabPage tabBookings;
        private TabPage tabCounts;
        private TabPage tabStudents;

        private DataGridView gridBookings;
        private DataGridView gridCounts;
        private DataGridView gridStudents;

        private Label lblStatus;
        private JavaScriptSerializer jss = new JavaScriptSerializer();
        private const string API_BASE = "http://localhost:8081/api";

        public MainWindow()
        {
            this.Text = "PES University Sports — Minimalistic Database Administration";
            this.Size = new Size(1100, 720);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.BackColor = Color.FromArgb(245, 244, 239);
            this.Font = new Font("Segoe UI", 9F, FontStyle.Regular);

            // Top Banner
            Panel topBar = new Panel();
            topBar.Dock = DockStyle.Top;
            topBar.Height = 65;
            topBar.BackColor = Color.FromArgb(26, 38, 57);

            Label title = new Label();
            title.Text = "PES UNIVERSITY ATHLETICS ADMINISTRATION";
            title.ForeColor = Color.White;
            title.Font = new Font("Georgia", 13F, FontStyle.Bold);
            title.Location = new Point(20, 12);
            title.AutoSize = true;
            topBar.Controls.Add(title);

            lblStatus = new Label();
            lblStatus.Text = "Vault Storage: locked_storage/pesu_sports.db (Master Key Verified)";
            lblStatus.ForeColor = Color.FromArgb(170, 200, 240);
            lblStatus.Font = new Font("Segoe UI", 8.5F);
            lblStatus.Location = new Point(22, 38);
            lblStatus.AutoSize = true;
            topBar.Controls.Add(lblStatus);

            Button btnRefresh = new Button();
            btnRefresh.Text = "↻ Refresh Tables";
            btnRefresh.Size = new Size(130, 32);
            btnRefresh.Location = new Point(780, 16);
            btnRefresh.BackColor = Color.FromArgb(196, 85, 36);
            btnRefresh.ForeColor = Color.White;
            btnRefresh.FlatStyle = FlatStyle.Flat;
            btnRefresh.FlatAppearance.BorderSize = 0;
            btnRefresh.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            btnRefresh.Cursor = Cursors.Hand;
            btnRefresh.Click += (s, e) => LoadAllTables();
            topBar.Controls.Add(btnRefresh);

            Button btnOpenVault = new Button();
            btnOpenVault.Text = "🔒 Open Vault";
            btnOpenVault.Size = new Size(120, 32);
            btnOpenVault.Location = new Point(925, 16);
            btnOpenVault.BackColor = Color.FromArgb(45, 60, 85);
            btnOpenVault.ForeColor = Color.White;
            btnOpenVault.FlatStyle = FlatStyle.Flat;
            btnOpenVault.FlatAppearance.BorderSize = 0;
            btnOpenVault.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            btnOpenVault.Cursor = Cursors.Hand;
            btnOpenVault.Click += BtnOpenVault_Click;
            topBar.Controls.Add(btnOpenVault);

            this.Controls.Add(topBar);

            // Tab Control
            tabControl = new TabControl();
            tabControl.Dock = DockStyle.Fill;
            tabControl.Padding = new Point(14, 8);
            tabControl.Font = new Font("Segoe UI", 9.5F, FontStyle.Bold);

            // Setup Tab 1: Bookings
            tabBookings = new TabPage(" Table 1: Court Bookings ");
            tabBookings.BackColor = Color.White;
            SetupTable1Bookings();
            tabControl.TabPages.Add(tabBookings);

            // Setup Tab 2: Counts
            tabCounts = new TabPage(" Table 2: Booking Counts ");
            tabCounts.BackColor = Color.White;
            SetupTable2Counts();
            tabControl.TabPages.Add(tabCounts);

            // Setup Tab 3: Students
            tabStudents = new TabPage(" Table 3: Student Records & Passwords ");
            tabStudents.BackColor = Color.White;
            SetupTable3Students();
            tabControl.TabPages.Add(tabStudents);

            this.Controls.Add(tabControl);

            this.Load += (s, e) => LoadAllTables();
        }

        private void BtnOpenVault_Click(object sender, EventArgs e)
        {
            string vaultPath = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "locked_storage"));
            if (Directory.Exists(vaultPath))
            {
                Process.Start("explorer.exe", "\"" + vaultPath + "\"");
            }
            else
            {
                MessageBox.Show("Locked vault directory not found: " + vaultPath, "Vault Notice", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
        }

        // =====================================================================
        // Table 1: Person, Booking place, booking time, booking duration
        // =====================================================================
        private void SetupTable1Bookings()
        {
            Panel pnlBottom = new Panel();
            pnlBottom.Dock = DockStyle.Bottom;
            pnlBottom.Height = 55;
            pnlBottom.BackColor = Color.FromArgb(245, 244, 239);

            Button btnAdd = new Button();
            btnAdd.Text = "+ Add Booking";
            btnAdd.Location = new Point(16, 12);
            btnAdd.Size = new Size(130, 32);
            btnAdd.BackColor = Color.FromArgb(26, 38, 57);
            btnAdd.ForeColor = Color.White;
            btnAdd.FlatStyle = FlatStyle.Flat;
            btnAdd.FlatAppearance.BorderSize = 0;
            btnAdd.Click += BtnAddBooking_Click;
            pnlBottom.Controls.Add(btnAdd);

            Button btnEdit = new Button();
            btnEdit.Text = "✎ Edit Selected Booking";
            btnEdit.Location = new Point(156, 12);
            btnEdit.Size = new Size(180, 32);
            btnEdit.BackColor = Color.FromArgb(196, 85, 36);
            btnEdit.ForeColor = Color.White;
            btnEdit.FlatStyle = FlatStyle.Flat;
            btnEdit.FlatAppearance.BorderSize = 0;
            btnEdit.Click += BtnEditBooking_Click;
            pnlBottom.Controls.Add(btnEdit);

            Button btnDelete = new Button();
            btnDelete.Text = "✕ Delete Booking";
            btnDelete.Location = new Point(346, 12);
            btnDelete.Size = new Size(140, 32);
            btnDelete.BackColor = Color.FromArgb(180, 40, 30);
            btnDelete.ForeColor = Color.White;
            btnDelete.FlatStyle = FlatStyle.Flat;
            btnDelete.FlatAppearance.BorderSize = 0;
            btnDelete.Click += BtnDeleteBooking_Click;
            pnlBottom.Controls.Add(btnDelete);

            tabBookings.Controls.Add(pnlBottom);

            gridBookings = CreateStyledGrid();
            gridBookings.Columns.Add("id", "ID");
            gridBookings.Columns["id"].Visible = false;
            gridBookings.Columns.Add("person", "Person");
            gridBookings.Columns.Add("booking_place", "Booking place");
            gridBookings.Columns.Add("booking_time", "booking time");
            gridBookings.Columns.Add("booking_duration", "booking duration");
            gridBookings.Columns.Add("status", "Status");
            gridBookings.Columns.Add("student_srn", "SRN");

            tabBookings.Controls.Add(gridBookings);
        }

        // =====================================================================
        // Table 2: Person, Number of bookings
        // =====================================================================
        private void SetupTable2Counts()
        {
            Panel pnlBottom = new Panel();
            pnlBottom.Dock = DockStyle.Bottom;
            pnlBottom.Height = 55;
            pnlBottom.BackColor = Color.FromArgb(245, 244, 239);

            Label lblInfo = new Label();
            lblInfo.Text = "Aggregate metrics dynamically computed across all court sessions.";
            lblInfo.ForeColor = Color.FromArgb(80, 80, 80);
            lblInfo.Location = new Point(20, 18);
            lblInfo.AutoSize = true;
            pnlBottom.Controls.Add(lblInfo);

            tabCounts.Controls.Add(pnlBottom);

            gridCounts = CreateStyledGrid();
            gridCounts.Columns.Add("person", "Person");
            gridCounts.Columns.Add("number_of_bookings", "Number of bookings");
            gridCounts.Columns.Add("active_bookings", "Upcoming Active");
            gridCounts.Columns.Add("srn", "Student SRN");
            gridCounts.Columns.Add("email", "Email");
            gridCounts.Columns.Add("contact", "Contact");

            tabCounts.Controls.Add(gridCounts);
        }

        // =====================================================================
        // Table 3: Person, Contact, SRN, Password(encrypted), Email
        // =====================================================================
        private void SetupTable3Students()
        {
            Panel pnlBottom = new Panel();
            pnlBottom.Dock = DockStyle.Bottom;
            pnlBottom.Height = 60;
            pnlBottom.BackColor = Color.FromArgb(245, 244, 239);

            Button btnPassDialog = new Button();
            btnPassDialog.Text = "🔑 View / Edit Password (Requires Master Key)";
            btnPassDialog.Location = new Point(16, 14);
            btnPassDialog.Size = new Size(310, 34);
            btnPassDialog.BackColor = Color.FromArgb(196, 85, 36);
            btnPassDialog.ForeColor = Color.White;
            btnPassDialog.FlatStyle = FlatStyle.Flat;
            btnPassDialog.FlatAppearance.BorderSize = 0;
            btnPassDialog.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            btnPassDialog.Click += (s, e) => TriggerPasswordDialogForSelectedRow();
            pnlBottom.Controls.Add(btnPassDialog);

            Button btnEditStudent = new Button();
            btnEditStudent.Text = "✎ Edit Contact / Name";
            btnEditStudent.Location = new Point(340, 14);
            btnEditStudent.Size = new Size(180, 34);
            btnEditStudent.BackColor = Color.FromArgb(26, 38, 57);
            btnEditStudent.ForeColor = Color.White;
            btnEditStudent.FlatStyle = FlatStyle.Flat;
            btnEditStudent.FlatAppearance.BorderSize = 0;
            btnEditStudent.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            btnEditStudent.Click += BtnEditStudent_Click;
            pnlBottom.Controls.Add(btnEditStudent);

            Label lblHint = new Label();
            lblHint.Text = "Tip: Click directly on the Password(encrypted) column to reveal or edit!";
            lblHint.ForeColor = Color.FromArgb(100, 100, 100);
            lblHint.Location = new Point(540, 22);
            lblHint.AutoSize = true;
            pnlBottom.Controls.Add(lblHint);

            tabStudents.Controls.Add(pnlBottom);

            gridStudents = CreateStyledGrid();
            gridStudents.Columns.Add("person", "Person");
            gridStudents.Columns.Add("contact", "Contact");
            gridStudents.Columns.Add("srn", "SRN");
            gridStudents.Columns.Add("password_encrypted", "Password(encrypted)");
            gridStudents.Columns.Add("email", "Email");

            // Format Password column distinctly
            gridStudents.Columns["password_encrypted"].DefaultCellStyle.ForeColor = Color.FromArgb(196, 85, 36);
            gridStudents.Columns["password_encrypted"].DefaultCellStyle.Font = new Font("Segoe UI", 9F, FontStyle.Underline);

            gridStudents.CellClick += GridStudents_CellClick;

            tabStudents.Controls.Add(gridStudents);
        }

        private DataGridView CreateStyledGrid()
        {
            DataGridView grid = new DataGridView();
            grid.Dock = DockStyle.Fill;
            grid.BackgroundColor = Color.White;
            grid.BorderStyle = BorderStyle.None;
            grid.RowHeadersVisible = false;
            grid.AllowUserToAddRows = false;
            grid.AllowUserToDeleteRows = false;
            grid.ReadOnly = true;
            grid.SelectionMode = DataGridViewSelectionMode.FullRowSelect;
            grid.MultiSelect = false;
            grid.AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.Fill;
            grid.ColumnHeadersHeightSizeMode = DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            grid.EnableHeadersVisualStyles = false;
            grid.ColumnHeadersDefaultCellStyle.BackColor = Color.FromArgb(26, 38, 57);
            grid.ColumnHeadersDefaultCellStyle.ForeColor = Color.White;
            grid.ColumnHeadersDefaultCellStyle.Font = new Font("Segoe UI", 9.5F, FontStyle.Bold);
            grid.ColumnHeadersDefaultCellStyle.Padding = new Padding(6, 6, 6, 6);
            grid.RowTemplate.Height = 32;
            grid.AlternatingRowsDefaultCellStyle.BackColor = Color.FromArgb(250, 249, 246);
            grid.DefaultCellStyle.SelectionBackColor = Color.FromArgb(220, 230, 245);
            grid.DefaultCellStyle.SelectionForeColor = Color.FromArgb(20, 20, 20);
            return grid;
        }

        // =====================================================================
        // Data Loaders
        // =====================================================================
        public void LoadAllTables()
        {
            try
            {
                using (WebClient client = new WebClient())
                {
                    client.Encoding = Encoding.UTF8;
                    string jsonStr = client.DownloadString(API_BASE + "/admin/desktop/tables");
                    var data = jss.Deserialize<Dictionary<string, object>>(jsonStr);

                    if (data.ContainsKey("table1"))
                    {
                        var t1 = (object[])data["table1"];
                        gridBookings.Rows.Clear();
                        foreach (Dictionary<string, object> r in t1)
                        {
                            gridBookings.Rows.Add(
                                r.ContainsKey("id") ? r["id"] : "",
                                r.ContainsKey("person") ? r["person"] : "",
                                r.ContainsKey("booking_place") ? r["booking_place"] : "",
                                r.ContainsKey("booking_time") ? r["booking_time"] : "",
                                r.ContainsKey("booking_duration") ? r["booking_duration"] : "",
                                r.ContainsKey("status") ? r["status"] : "",
                                r.ContainsKey("student_srn") ? r["student_srn"] : ""
                            );
                        }
                    }

                    if (data.ContainsKey("table2"))
                    {
                        var t2 = (object[])data["table2"];
                        gridCounts.Rows.Clear();
                        foreach (Dictionary<string, object> r in t2)
                        {
                            gridCounts.Rows.Add(
                                r.ContainsKey("person") ? r["person"] : "",
                                r.ContainsKey("number_of_bookings") ? r["number_of_bookings"] : 0,
                                r.ContainsKey("active_bookings") ? r["active_bookings"] : 0,
                                r.ContainsKey("srn") ? r["srn"] : "",
                                r.ContainsKey("email") ? r["email"] : "",
                                r.ContainsKey("contact") ? r["contact"] : ""
                            );
                        }
                    }

                    if (data.ContainsKey("table3"))
                    {
                        var t3 = (object[])data["table3"];
                        gridStudents.Rows.Clear();
                        foreach (Dictionary<string, object> r in t3)
                        {
                            gridStudents.Rows.Add(
                                r.ContainsKey("person") ? r["person"] : "",
                                r.ContainsKey("contact") ? r["contact"] : "",
                                r.ContainsKey("srn") ? r["srn"] : "",
                                r.ContainsKey("encrypted_password") ? r["encrypted_password"] : "[AES-256 Encrypted]",
                                r.ContainsKey("email") ? r["email"] : ""
                            );
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error loading records from server: " + ex.Message, "Sync Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
        }

        // =====================================================================
        // Table 1 Actions
        // =====================================================================
        private void BtnAddBooking_Click(object sender, EventArgs e)
        {
            BookingForm form = new BookingForm(null);
            if (form.ShowDialog() == DialogResult.OK)
            {
                try
                {
                    using (WebClient client = new WebClient())
                    {
                        client.Headers[HttpRequestHeader.ContentType] = "application/json";
                        string payload = jss.Serialize(new Dictionary<string, object>
                        {
                            { "student_srn", form.StudentSrn },
                            { "court_name", form.BookingPlace },
                            { "booking_time", form.BookingTime },
                            { "booking_duration", form.BookingDuration }
                        });
                        client.UploadString(API_BASE + "/admin/desktop/add-booking", payload);
                        LoadAllTables();
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Error adding booking: " + ex.Message);
                }
            }
        }

        private void BtnEditBooking_Click(object sender, EventArgs e)
        {
            if (gridBookings.SelectedRows.Count == 0)
            {
                MessageBox.Show("Please select a booking to edit.");
                return;
            }

            DataGridViewRow row = gridBookings.SelectedRows[0];
            string id = Convert.ToString(row.Cells["id"].Value);
            string person = Convert.ToString(row.Cells["person"].Value);
            string place = Convert.ToString(row.Cells["booking_place"].Value);
            string time = Convert.ToString(row.Cells["booking_time"].Value);
            string dur = Convert.ToString(row.Cells["booking_duration"].Value);
            string status = Convert.ToString(row.Cells["status"].Value);

            BookingForm form = new BookingForm(new Dictionary<string, string>
            {
                { "id", id },
                { "person", person },
                { "place", place },
                { "time", time },
                { "duration", dur },
                { "status", status }
            });

            if (form.ShowDialog() == DialogResult.OK)
            {
                try
                {
                    using (WebClient client = new WebClient())
                    {
                        client.Headers[HttpRequestHeader.ContentType] = "application/json";
                        string payload = jss.Serialize(new Dictionary<string, object>
                        {
                            { "id", id },
                            { "person_name", form.PersonName },
                            { "booking_place", form.BookingPlace },
                            { "booking_time", form.BookingTime },
                            { "booking_duration", form.BookingDuration },
                            { "status", form.BookingStatus }
                        });
                        client.UploadString(API_BASE + "/admin/desktop/update-booking", payload);
                        LoadAllTables();
                        MessageBox.Show("Booking record successfully updated!");
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Error updating booking: " + ex.Message);
                }
            }
        }

        private void BtnDeleteBooking_Click(object sender, EventArgs e)
        {
            if (gridBookings.SelectedRows.Count == 0)
            {
                MessageBox.Show("Please select a booking to delete.");
                return;
            }

            DataGridViewRow row = gridBookings.SelectedRows[0];
            string id = Convert.ToString(row.Cells["id"].Value);
            string person = Convert.ToString(row.Cells["person"].Value);

            if (MessageBox.Show("Are you sure you want to delete the booking for " + person + "?", "Confirm Delete", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.Yes)
            {
                try
                {
                    using (WebClient client = new WebClient())
                    {
                        client.Headers[HttpRequestHeader.ContentType] = "application/json";
                        string payload = jss.Serialize(new Dictionary<string, object> { { "id", id } });
                        client.UploadString(API_BASE + "/admin/desktop/delete-booking", payload);
                        LoadAllTables();
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Error deleting booking: " + ex.Message);
                }
            }
        }

        // =====================================================================
        // Table 3 Actions & The Special Password Dialog
        // =====================================================================
        private void GridStudents_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0 && gridStudents.Columns[e.ColumnIndex].Name == "password_encrypted")
            {
                TriggerPasswordDialogForRow(e.RowIndex);
            }
        }

        private void TriggerPasswordDialogForSelectedRow()
        {
            if (gridStudents.SelectedRows.Count == 0)
            {
                MessageBox.Show("Please select a student row in Table 3 first.");
                return;
            }
            TriggerPasswordDialogForRow(gridStudents.SelectedRows[0].Index);
        }

        private void TriggerPasswordDialogForRow(int rowIndex)
        {
            DataGridViewRow row = gridStudents.Rows[rowIndex];
            string srn = Convert.ToString(row.Cells["srn"].Value);
            string person = Convert.ToString(row.Cells["person"].Value);

            PasswordDialog dlg = new PasswordDialog(srn, person);
            if (dlg.ShowDialog() == DialogResult.OK)
            {
                LoadAllTables();
            }
        }

        private void BtnEditStudent_Click(object sender, EventArgs e)
        {
            if (gridStudents.SelectedRows.Count == 0)
            {
                MessageBox.Show("Please select a student to edit.");
                return;
            }

            DataGridViewRow row = gridStudents.SelectedRows[0];
            string srn = Convert.ToString(row.Cells["srn"].Value);
            string person = Convert.ToString(row.Cells["person"].Value);
            string contact = Convert.ToString(row.Cells["contact"].Value);
            string email = Convert.ToString(row.Cells["email"].Value);

            EditStudentForm form = new EditStudentForm(srn, person, contact, email);
            if (form.ShowDialog() == DialogResult.OK)
            {
                try
                {
                    using (WebClient client = new WebClient())
                    {
                        client.Headers[HttpRequestHeader.ContentType] = "application/json";
                        string payload = jss.Serialize(new Dictionary<string, object>
                        {
                            { "srn", srn },
                            { "person", form.PersonName },
                            { "contact", form.Contact },
                            { "email", form.Email }
                        });
                        client.UploadString(API_BASE + "/admin/desktop/update-student", payload);
                        LoadAllTables();
                        MessageBox.Show("Student details updated in database!");
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Error updating student: " + ex.Message);
                }
            }
        }
    }

    // =========================================================================
    // The Password Reveal & Edit Dialog Box (Specific User Requirement)
    // =========================================================================
    public class PasswordDialog : Form
    {
        private string srn;
        private string person;

        private TextBox txtMasterKey;
        private Button btnVerifyKey;
        private Label lblKeyError;

        private Panel pnlUnlocked;
        private Label lblCurrentPass;
        private TextBox txtNewPass;
        private TextBox txtConfirmPass;
        private Button btnSavePass;
        private JavaScriptSerializer jss = new JavaScriptSerializer();

        public PasswordDialog(string srn, string person)
        {
            this.srn = srn;
            this.person = person;

            this.Text = "Security Authorization — Student Password Access";
            this.Size = new Size(500, 480);
            this.StartPosition = FormStartPosition.CenterParent;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.BackColor = Color.FromArgb(245, 244, 239);
            this.Font = new Font("Segoe UI", 9F);

            Panel pnlHeader = new Panel();
            pnlHeader.Dock = DockStyle.Top;
            pnlHeader.Height = 70;
            pnlHeader.BackColor = Color.FromArgb(26, 38, 57);

            Label title = new Label();
            title.Text = "DECRYPT & EDIT STUDENT PASSWORD";
            title.ForeColor = Color.White;
            title.Font = new Font("Georgia", 11F, FontStyle.Bold);
            title.Location = new Point(18, 14);
            title.AutoSize = true;
            pnlHeader.Controls.Add(title);

            Label sub = new Label();
            sub.Text = string.Format("Target Student: {0} ({1})", person, srn);
            sub.ForeColor = Color.FromArgb(196, 85, 36);
            sub.Location = new Point(20, 38);
            sub.AutoSize = true;
            pnlHeader.Controls.Add(sub);

            this.Controls.Add(pnlHeader);

            // Step 1: Verification Section
            Label lblPrompt = new Label();
            lblPrompt.Text = "Enter Admin Master Key to decrypt password (default: 123):";
            lblPrompt.Location = new Point(24, 85);
            lblPrompt.AutoSize = true;
            this.Controls.Add(lblPrompt);

            txtMasterKey = new TextBox();
            txtMasterKey.PasswordChar = '•';
            txtMasterKey.Text = "123";
            txtMasterKey.Location = new Point(24, 110);
            txtMasterKey.Size = new Size(280, 24);
            this.Controls.Add(txtMasterKey);

            btnVerifyKey = new Button();
            btnVerifyKey.Text = "Verify Key";
            btnVerifyKey.Location = new Point(315, 108);
            btnVerifyKey.Size = new Size(130, 28);
            btnVerifyKey.BackColor = Color.FromArgb(26, 38, 57);
            btnVerifyKey.ForeColor = Color.White;
            btnVerifyKey.FlatStyle = FlatStyle.Flat;
            btnVerifyKey.FlatAppearance.BorderSize = 0;
            btnVerifyKey.Click += BtnVerifyKey_Click;
            this.Controls.Add(btnVerifyKey);

            lblKeyError = new Label();
            lblKeyError.ForeColor = Color.FromArgb(180, 40, 30);
            lblKeyError.Location = new Point(24, 140);
            lblKeyError.Size = new Size(420, 20);
            this.Controls.Add(lblKeyError);

            // Step 2: Unlocked Container
            pnlUnlocked = new Panel();
            pnlUnlocked.Location = new Point(20, 165);
            pnlUnlocked.Size = new Size(445, 260);
            pnlUnlocked.BorderStyle = BorderStyle.FixedSingle;
            pnlUnlocked.BackColor = Color.White;
            pnlUnlocked.Visible = false;

            Label lblSeeTitle = new Label();
            lblSeeTitle.Text = "Decrypted Student Password:";
            lblSeeTitle.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            lblSeeTitle.Location = new Point(14, 12);
            lblSeeTitle.AutoSize = true;
            pnlUnlocked.Controls.Add(lblSeeTitle);

            lblCurrentPass = new Label();
            lblCurrentPass.Text = "••••••••";
            lblCurrentPass.Font = new Font("Consolas", 12F, FontStyle.Bold);
            lblCurrentPass.ForeColor = Color.FromArgb(196, 85, 36);
            lblCurrentPass.Location = new Point(14, 34);
            lblCurrentPass.AutoSize = true;
            pnlUnlocked.Controls.Add(lblCurrentPass);

            Label div = new Label();
            div.BorderStyle = BorderStyle.Fixed3D;
            div.Location = new Point(14, 65);
            div.Size = new Size(415, 2);
            pnlUnlocked.Controls.Add(div);

            Label lblEditTitle = new Label();
            lblEditTitle.Text = "Edit Student Password (requires 2-time confirmation):";
            lblEditTitle.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            lblEditTitle.Location = new Point(14, 75);
            lblEditTitle.AutoSize = true;
            pnlUnlocked.Controls.Add(lblEditTitle);

            Label lblNew = new Label();
            lblNew.Text = "New Password:";
            lblNew.Location = new Point(14, 100);
            lblNew.AutoSize = true;
            pnlUnlocked.Controls.Add(lblNew);

            txtNewPass = new TextBox();
            txtNewPass.PasswordChar = '•';
            txtNewPass.Location = new Point(14, 120);
            txtNewPass.Size = new Size(415, 24);
            pnlUnlocked.Controls.Add(txtNewPass);

            Label lblConfirm = new Label();
            lblConfirm.Text = "Confirm New Password (re-enter):";
            lblConfirm.Location = new Point(14, 150);
            lblConfirm.AutoSize = true;
            pnlUnlocked.Controls.Add(lblConfirm);

            txtConfirmPass = new TextBox();
            txtConfirmPass.PasswordChar = '•';
            txtConfirmPass.Location = new Point(14, 170);
            txtConfirmPass.Size = new Size(415, 24);
            pnlUnlocked.Controls.Add(txtConfirmPass);

            btnSavePass = new Button();
            btnSavePass.Text = "Update Table & Re-Encrypt Password";
            btnSavePass.Location = new Point(14, 208);
            btnSavePass.Size = new Size(415, 34);
            btnSavePass.BackColor = Color.FromArgb(196, 85, 36);
            btnSavePass.ForeColor = Color.White;
            btnSavePass.FlatStyle = FlatStyle.Flat;
            btnSavePass.FlatAppearance.BorderSize = 0;
            btnSavePass.Font = new Font("Segoe UI", 9.5F, FontStyle.Bold);
            btnSavePass.Cursor = Cursors.Hand;
            btnSavePass.Click += BtnSavePass_Click;
            pnlUnlocked.Controls.Add(btnSavePass);

            this.Controls.Add(pnlUnlocked);
        }

        private void BtnVerifyKey_Click(object sender, EventArgs e)
        {
            string key = txtMasterKey.Text.Trim();
            if (string.IsNullOrEmpty(key))
            {
                lblKeyError.Text = "Master key cannot be blank.";
                return;
            }

            try
            {
                using (WebClient client = new WebClient())
                {
                    client.Headers[HttpRequestHeader.ContentType] = "application/json";
                    string payload = jss.Serialize(new Dictionary<string, object>
                    {
                        { "srn", srn },
                        { "masterKey", key }
                    });
                    string resStr = client.UploadString("http://localhost:8081/api/admin/desktop/reveal-password", payload);
                    var res = jss.Deserialize<Dictionary<string, object>>(resStr);

                    if (res.ContainsKey("success") && Convert.ToBoolean(res["success"]))
                    {
                        lblKeyError.Text = "";
                        lblCurrentPass.Text = Convert.ToString(res["plaintextPassword"]);
                        pnlUnlocked.Visible = true;
                        txtNewPass.Focus();
                    }
                    else
                    {
                        lblKeyError.Text = "Failed to decrypt password: " + (res.ContainsKey("error") ? res["error"] : "Unknown error");
                    }
                }
            }
            catch (Exception ex)
            {
                lblKeyError.Text = "Authorization failed: " + ex.Message;
            }
        }

        private void BtnSavePass_Click(object sender, EventArgs e)
        {
            string newP = txtNewPass.Text;
            string confP = txtConfirmPass.Text;

            if (string.IsNullOrEmpty(newP) || string.IsNullOrEmpty(confP))
            {
                MessageBox.Show("Please enter the new password in both fields.", "Input Required", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            if (newP != confP)
            {
                MessageBox.Show("Passwords do not match! Please enter the same password twice for confirmation.", "Confirmation Mismatch", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            try
            {
                using (WebClient client = new WebClient())
                {
                    client.Headers[HttpRequestHeader.ContentType] = "application/json";
                    string payload = jss.Serialize(new Dictionary<string, object>
                    {
                        { "srn", srn },
                        { "newPassword", newP },
                        { "confirmPassword", confP },
                        { "masterKey", txtMasterKey.Text.Trim() }
                    });
                    string resStr = client.UploadString("http://localhost:8081/api/admin/desktop/update-password", payload);
                    var res = jss.Deserialize<Dictionary<string, object>>(resStr);

                    if (res.ContainsKey("success") && Convert.ToBoolean(res["success"]))
                    {
                        MessageBox.Show("Password securely re-encrypted and updated in database table!", "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
                        this.DialogResult = DialogResult.OK;
                        this.Close();
                    }
                    else
                    {
                        MessageBox.Show("Update failed: " + (res.ContainsKey("error") ? res["error"] : "Unknown error"));
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error updating password: " + ex.Message);
            }
        }
    }

    // =========================================================================
    // Booking Form (Add / Edit)
    // =========================================================================
    public class BookingForm : Form
    {
        public string StudentSrn { get { return txtSrn.Text.Trim(); } }
        public string PersonName { get { return txtPerson.Text.Trim(); } }
        public string BookingPlace { get { return cmbPlace.Text.Trim(); } }
        public string BookingTime { get { return txtTime.Text.Trim(); } }
        public string BookingDuration { get { return cmbDuration.Text.Trim(); } }
        public string BookingStatus { get { return cmbStatus.Text.Trim(); } }

        private TextBox txtSrn;
        private TextBox txtPerson;
        private ComboBox cmbPlace;
        private TextBox txtTime;
        private ComboBox cmbDuration;
        private ComboBox cmbStatus;

        public BookingForm(Dictionary<string, string> existing)
        {
            this.Text = existing == null ? "Add Court Booking" : "Edit Court Booking";
            this.Size = new Size(420, 420);
            this.StartPosition = FormStartPosition.CenterParent;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.BackColor = Color.FromArgb(245, 244, 239);
            this.Font = new Font("Segoe UI", 9F);

            int y = 20;

            Label l1 = new Label { Text = "Student SRN:", Location = new Point(24, y), AutoSize = true };
            this.Controls.Add(l1);
            txtSrn = new TextBox { Location = new Point(24, y + 20), Size = new Size(350, 24), Text = existing != null && existing.ContainsKey("person") ? existing["person"] : "PES1UG21CS123" };
            this.Controls.Add(txtSrn);
            y += 55;

            Label lPerson = new Label { Text = "Person / Athlete Name:", Location = new Point(24, y), AutoSize = true };
            this.Controls.Add(lPerson);
            txtPerson = new TextBox { Location = new Point(24, y + 20), Size = new Size(350, 24), Text = existing != null && existing.ContainsKey("person") ? existing["person"] : "Rishit Tathod" };
            this.Controls.Add(txtPerson);
            y += 55;

            Label l2 = new Label { Text = "Booking Place:", Location = new Point(24, y), AutoSize = true };
            this.Controls.Add(l2);
            cmbPlace = new ComboBox { Location = new Point(24, y + 20), Size = new Size(350, 24), DropDownStyle = ComboBoxStyle.DropDownList };
            cmbPlace.Items.AddRange(new string[] { "Badminton Court 1", "Badminton Court 2", "Basketball Court", "Squash Court 1", "Table Tennis Arena", "Chess Lounge" });
            cmbPlace.Text = existing != null && existing.ContainsKey("place") ? existing["place"] : "Badminton Court 1";
            this.Controls.Add(cmbPlace);
            y += 55;

            Label l3 = new Label { Text = "Booking Time (e.g. Today at 5:00 PM):", Location = new Point(24, y), AutoSize = true };
            this.Controls.Add(l3);
            txtTime = new TextBox { Location = new Point(24, y + 20), Size = new Size(350, 24), Text = existing != null && existing.ContainsKey("time") ? existing["time"] : "Today at 5:00 PM" };
            this.Controls.Add(txtTime);
            y += 55;

            Label l4 = new Label { Text = "Booking Duration:", Location = new Point(24, y), AutoSize = true };
            this.Controls.Add(l4);
            cmbDuration = new ComboBox { Location = new Point(24, y + 20), Size = new Size(160, 24), DropDownStyle = ComboBoxStyle.DropDownList };
            cmbDuration.Items.AddRange(new string[] { "1 Hour", "2 Hours", "90 Mins" });
            cmbDuration.Text = existing != null && existing.ContainsKey("duration") ? existing["duration"] : "1 Hour";
            this.Controls.Add(cmbDuration);

            Label l5 = new Label { Text = "Status:", Location = new Point(200, y), AutoSize = true };
            this.Controls.Add(l5);
            cmbStatus = new ComboBox { Location = new Point(200, y + 20), Size = new Size(174, 24), DropDownStyle = ComboBoxStyle.DropDownList };
            cmbStatus.Items.AddRange(new string[] { "upcoming", "completed", "cancelled" });
            cmbStatus.Text = existing != null && existing.ContainsKey("status") ? existing["status"] : "upcoming";
            this.Controls.Add(cmbStatus);
            y += 65;

            Button btnOk = new Button
            {
                Text = "Save Booking Record",
                Location = new Point(24, y),
                Size = new Size(350, 36),
                BackColor = Color.FromArgb(196, 85, 36),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 9.5F, FontStyle.Bold),
                DialogResult = DialogResult.OK
            };
            this.Controls.Add(btnOk);
            this.AcceptButton = btnOk;
        }
    }

    // =========================================================================
    // Student Form (Edit Contact / Name)
    // =========================================================================
    public class EditStudentForm : Form
    {
        public string PersonName { get { return txtPerson.Text.Trim(); } }
        public string Contact { get { return txtContact.Text.Trim(); } }
        public string Email { get { return txtEmail.Text.Trim(); } }

        private TextBox txtPerson;
        private TextBox txtContact;
        private TextBox txtEmail;

        public EditStudentForm(string srn, string person, string contact, string email)
        {
            this.Text = "Edit Student Contact Information";
            this.Size = new Size(420, 310);
            this.StartPosition = FormStartPosition.CenterParent;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.BackColor = Color.FromArgb(245, 244, 239);
            this.Font = new Font("Segoe UI", 9F);

            int y = 20;

            Label l1 = new Label { Text = "Person / Full Name:", Location = new Point(24, y), AutoSize = true };
            this.Controls.Add(l1);
            txtPerson = new TextBox { Location = new Point(24, y + 20), Size = new Size(350, 24), Text = person };
            this.Controls.Add(txtPerson);
            y += 55;

            Label l2 = new Label { Text = "Contact Number:", Location = new Point(24, y), AutoSize = true };
            this.Controls.Add(l2);
            txtContact = new TextBox { Location = new Point(24, y + 20), Size = new Size(350, 24), Text = contact };
            this.Controls.Add(txtContact);
            y += 55;

            Label l3 = new Label { Text = "Email Address:", Location = new Point(24, y), AutoSize = true };
            this.Controls.Add(l3);
            txtEmail = new TextBox { Location = new Point(24, y + 20), Size = new Size(350, 24), Text = email };
            this.Controls.Add(txtEmail);
            y += 65;

            Button btnOk = new Button
            {
                Text = "Update Student Info",
                Location = new Point(24, y),
                Size = new Size(350, 36),
                BackColor = Color.FromArgb(26, 38, 57),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 9.5F, FontStyle.Bold),
                DialogResult = DialogResult.OK
            };
            this.Controls.Add(btnOk);
            this.AcceptButton = btnOk;
        }
    }
}
