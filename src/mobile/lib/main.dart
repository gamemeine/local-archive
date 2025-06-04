import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'package:auth0_flutter/auth0_flutter.dart';

void main() {
  runApp(MyApp());
}

final auth0 = Auth0(
  'dev-y5sk84ei4zmzfbxz.us.auth0.com',
  'arfNPGRxdmCtJdRscdYmyyUoBIptGFe2',
);

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(title: 'Flutter Auth Upload', home: LoginPage());
  }
}

class LoginPage extends StatefulWidget {
  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final usernameController = TextEditingController();
  final passwordController = TextEditingController();

  void loginManually() {
    if (usernameController.text == 'admin' &&
        passwordController.text == 'admin') {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => UploadScreen()),
      );
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Niepoprawne dane logowania')));
    }
  }

  void loginWithAuth0() async {
    try {
      final result =
          await auth0
              .webAuthentication(scheme: 'com.example.localarchive')
              .login();
      print('Logged in: ${result.accessToken}');
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => UploadScreen()),
      );
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Auth0 login failed: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Login')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Image.asset('assets/logo.png', height: 100),
              SizedBox(height: 12),
              ElevatedButton(
                onPressed: loginWithAuth0,
                child: Text('Zaloguj za pomocą Auth0'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class UploadScreen extends StatefulWidget {
  @override
  State<UploadScreen> createState() => _UploadScreenState();
}

class _UploadScreenState extends State<UploadScreen> {
  File? _image;
  final picker = ImagePicker();
  final textController = TextEditingController();

  // Date fields
  bool preciseDate = true;
  DateTime? selectedDate;
  String? year;
  String? month;
  String? day;

  // Location fields
  bool preciseLocation = true;
  String? address;
  String? city;
  String? state;
  String? postalCode;
  String? street;

  Future pickImage(ImageSource source) async {
    final pickedFile = await picker.pickImage(source: source);
    if (pickedFile != null) {
      setState(() {
        _image = File(pickedFile.path);
      });
    }
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );
    if (picked != null && picked != selectedDate) {
      setState(() {
        selectedDate = picked;
      });
    }
  }

  void sendToApi() {
    final photoData = {
      'image': _image?.path,
      'description': textController.text,
      'preciseDate': preciseDate,
      'date': preciseDate ? selectedDate?.toString() : null,
      'year': preciseDate ? null : year,
      'month': preciseDate ? null : month,
      'day': preciseDate ? null : day,
      'preciseLocation': preciseLocation,
      'address': preciseLocation ? address : null,
      'city': preciseLocation ? null : city,
      'state': preciseLocation ? null : state,
      'postalCode': preciseLocation ? null : postalCode,
      'street': preciseLocation ? null : street,
    };

    print(photoData);
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text('Zdjęcie gotowe do wysłania')));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Dodaj zdjęcie'), elevation: 0),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Image Preview and Selection
            Container(
              height: 200,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey),
                borderRadius: BorderRadius.circular(8),
              ),
              child:
                  _image != null
                      ? ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.file(_image!, fit: BoxFit.cover),
                      )
                      : Center(child: Text('Brak wybranego zdjęcia')),
            ),
            SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    icon: Icon(Icons.photo_library),
                    label: Text('Galeria'),
                    onPressed: () => pickImage(ImageSource.gallery),
                    style: ElevatedButton.styleFrom(
                      padding: EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),
                SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton.icon(
                    icon: Icon(Icons.camera_alt),
                    label: Text('Aparat'),
                    onPressed: () => pickImage(ImageSource.camera),
                    style: ElevatedButton.styleFrom(
                      padding: EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),
              ],
            ),

            // Date Selection Section
            _buildSectionDivider('Date Information'),
            Text('Czy znasz dokładną datę?', style: _sectionTitleStyle()),
            SizedBox(height: 8),
            _buildToggleButtons(
              options: ['Tak', 'Nie'],
              isSelected: [preciseDate, !preciseDate],
              onPressed: (index) => setState(() => preciseDate = index == 0),
            ),
            SizedBox(height: 16),
            preciseDate
                ? Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Data utworzenia:', style: _fieldLabelStyle()),
                    SizedBox(height: 8),
                    ElevatedButton(
                      onPressed: () => _selectDate(context),
                      style: ElevatedButton.styleFrom(
                        minimumSize: Size(double.infinity, 50),
                        backgroundColor: Colors.grey[200],
                        foregroundColor: Colors.black87,
                      ),
                      child: Text(
                        selectedDate != null
                            ? '${selectedDate!.day}/${selectedDate!.month}/${selectedDate!.year}'
                            : 'Wybierz datę',
                      ),
                    ),
                  ],
                )
                : Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    TextField(
                      decoration: InputDecoration(
                        labelText: 'Rok',
                        border: OutlineInputBorder(),
                      ),
                      onChanged: (value) => year = value,
                      keyboardType: TextInputType.number,
                    ),
                    SizedBox(height: 12),
                    TextField(
                      decoration: InputDecoration(
                        labelText: 'Miesiąc',
                        border: OutlineInputBorder(),
                      ),
                      onChanged: (value) => month = value,
                      keyboardType: TextInputType.number,
                    ),
                    SizedBox(height: 12),
                    TextField(
                      decoration: InputDecoration(
                        labelText: 'Dzień',
                        border: OutlineInputBorder(),
                      ),
                      onChanged: (value) => day = value,
                      keyboardType: TextInputType.number,
                    ),
                  ],
                ),

            // Location Section
            _buildSectionDivider('Location Information'),
            Text(
              'Czy znasz dokładną lokalizację?',
              style: _sectionTitleStyle(),
            ),
            SizedBox(height: 8),
            _buildToggleButtons(
              options: ['Tak', 'Nie'],
              isSelected: [preciseLocation, !preciseLocation],
              onPressed:
                  (index) => setState(() => preciseLocation = index == 0),
            ),
            SizedBox(height: 16),
            preciseLocation
                ? Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Dokładna lokalizacja:', style: _fieldLabelStyle()),
                    SizedBox(height: 8),
                    ElevatedButton(
                      onPressed: () {
                        setState(() {
                          address =
                              'Rondo Daszyńskiego 1, Warszawa (52.2297, 21.0122)';
                        });
                      },
                      style: ElevatedButton.styleFrom(
                        minimumSize: Size(double.infinity, 50),
                      ),
                      child: Text('Wybierz na mapie'),
                    ),
                    if (address != null) ...[
                      SizedBox(height: 8),
                      Text(
                        'Wybrano: $address',
                        style: TextStyle(color: Colors.grey[600]),
                      ),
                    ],
                  ],
                )
                : Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    TextField(
                      decoration: InputDecoration(
                        labelText: 'Miasto',
                        border: OutlineInputBorder(),
                      ),
                      onChanged: (value) => city = value,
                    ),
                    SizedBox(height: 12),
                    TextField(
                      decoration: InputDecoration(
                        labelText: 'Województwo',
                        border: OutlineInputBorder(),
                      ),
                      onChanged: (value) => state = value,
                    ),
                    SizedBox(height: 12),
                    TextField(
                      decoration: InputDecoration(
                        labelText: 'Kod pocztowy',
                        border: OutlineInputBorder(),
                      ),
                      onChanged: (value) => postalCode = value,
                    ),
                    SizedBox(height: 12),
                    TextField(
                      decoration: InputDecoration(
                        labelText: 'Ulica i numer',
                        border: OutlineInputBorder(),
                      ),
                      onChanged: (value) => street = value,
                    ),
                  ],
                ),

            // Photo Description
            _buildSectionDivider('Photo Details'),
            Text('Opis zawartości zdjęcia', style: _sectionTitleStyle()),
            SizedBox(height: 8),
            TextField(
              controller: textController,
              decoration: InputDecoration(
                hintText: 'Co jest na zdjęciu?',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),

            // Submit Button
            SizedBox(height: 32),
            ElevatedButton(
              onPressed: sendToApi,
              style: ElevatedButton.styleFrom(
                minimumSize: Size(double.infinity, 50),
                backgroundColor: Theme.of(context).primaryColor,
                foregroundColor: Colors.white,
              ),
              child: Text('Dodaj zdjęcie'),
            ),
          ],
        ),
      ),
    );
  }

  // Helper Widgets
  Widget _buildSectionDivider(String text) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 24),
      child: Row(
        children: [
          Expanded(child: Divider()),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 8),
            child: Text(text, style: TextStyle(color: Colors.grey)),
          ),
          Expanded(child: Divider()),
        ],
      ),
    );
  }

  Widget _buildToggleButtons({
    required List<String> options,
    required List<bool> isSelected,
    required Function(int) onPressed,
  }) {
    return ToggleButtons(
      isSelected: isSelected,
      onPressed: onPressed,
      borderRadius: BorderRadius.circular(8),
      selectedColor: Theme.of(context).primaryColor,
      fillColor: Theme.of(context).primaryColor.withOpacity(0.1),
      constraints: BoxConstraints(minHeight: 40),
      children:
          options
              .map(
                (option) => Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16),
                  child: Text(option),
                ),
              )
              .toList(),
    );
  }

  TextStyle _sectionTitleStyle() {
    return TextStyle(
      fontSize: 16,
      fontWeight: FontWeight.bold,
      color: Colors.grey[800],
    );
  }

  TextStyle _fieldLabelStyle() {
    return TextStyle(
      fontSize: 14,
      fontWeight: FontWeight.w500,
      color: Colors.grey[700],
    );
  }
}
