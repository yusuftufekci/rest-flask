#include "DHT.h"
#define DHTTYPE DHT11
#include <MySQL_Connection.h>
#include <MySQL_Cursor.h>
#include <ESP8266WiFi.h>
#include <EasyStringStream.h>
#include <time.h>

uint8_t DHTPin = 12; //Board Setup
DHT dht(DHTPin, DHTTYPE);

const char* ssid = "SUPERONLINE_WiFi_1459"; //Wifi Connection
const char* pass = "HCVC7A37MFCF";

IPAddress server_addr(34,121,66,9); //MySQL ConnectionH
char user[] = "root";
char password[] = "karadeniz";

WiFiClient client;
MySQL_Connection conn(&client);
MySQL_Cursor* cursor;

int timezone = 3 * 3600;
int dst = 0;

void setup()
{
  delay(5000);
  Serial.begin(256000);
  Serial.println("Connecting to Wifi");
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nConnected to network"); 

  configTime(timezone, dst, "pool.ntp.org","time.nist.gov");

  Serial.print("Connecting to SQL...  ");
  if (conn.connect(server_addr, 3306, user, password))
    Serial.println("OK.");
  else
    Serial.println("FAILED.");

  cursor = new MySQL_Cursor(&conn);

  pinMode(DHTPin, INPUT);
  dht.begin();
} 

void loop()
{
  time_t now = time(nullptr);
  struct tm* p_tm = localtime(&now);
  String date = "";
  date.concat(p_tm->tm_mday);
  date.concat("/");
  date.concat(p_tm->tm_mon + 1);
  date.concat("/");
  date.concat(p_tm->tm_year + 1900);
  date.concat(" ");
  date.concat(p_tm->tm_hour);
  date.concat(":");
  date.concat(p_tm->tm_min);
  date.concat(":");
  date.concat(p_tm->tm_sec);
  
  if(conn.connected()){
    unsigned long temp = dht.readTemperature();
    unsigned long hum = dht.readHumidity();
    unsigned long cID = 72;
    unsigned long ID = NULL;
    Serial.println(temp);
    Serial.println(hum);
    Serial.println(date);
    Serial.println(cID);
    String INSERT_SQL = "";
    INSERT_SQL.concat("INSERT INTO lecture_schedule1.sensors (ID, tempature, classroomID, humidity, `date`) VALUES (");
    INSERT_SQL.concat(ID);
    INSERT_SQL.concat(", ");
    INSERT_SQL.concat(temp);
    INSERT_SQL.concat(", ");
    INSERT_SQL.concat(cID);
    INSERT_SQL.concat(", ");
    INSERT_SQL.concat(hum);
    INSERT_SQL.concat(", ");
    INSERT_SQL.concat(" \" ");
    INSERT_SQL.concat(date);
    INSERT_SQL.concat(" \" ");
    INSERT_SQL.concat(");");

    Serial.println(INSERT_SQL);
    const char *query = INSERT_SQL.c_str();
    cursor->execute(query);
  }

  delay(20000);
}
