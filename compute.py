import matplotlib
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter


def to_percent(y, position):
    # Ignore the passed in position. This has the effect of scaling the default
    # tick locations.
    s = str(round((y / 1289 * 100), 2))

    # The percent symbol needs escaping in latex
    if matplotlib.rcParams['text.usetex'] is True:
        return s + r'$\%$'
    else:
        return s + '%'


with open("data.txt") as f:
    content = f.readlines()

content = [x.strip() for x in content]
content = content[16:]

for i in range(len(content)):
    content[i] = float(content[i][content[i].find(":") + 2:-2])

print(content)

plt.hist(content, bins=50)
plt.title(
    "Daily fluctuations percentage for BINANCT:BTCUSDT between August 17 2017 - February 25 2021"
)
plt.xlabel("Fluctuate percentage")
plt.ylabel("Percentage out of 1289 data points")
formatter = FuncFormatter(to_percent)
plt.gca().yaxis.set_major_formatter(formatter)
plt.xticks([x for x in range(-40, 25, 2)])
plt.show()